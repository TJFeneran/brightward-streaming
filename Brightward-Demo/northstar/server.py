from typing import Literal
from urllib.parse import urlsplit
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.middleware.trustedhost import TrustedHostMiddleware
from openai import APIError
from .corpus import ROOT, DATA, FILES, catalog, load_state
from .triage import generate
from .changes import get_changes, selected_change_context
from . import relevance
from . import settings

app = FastAPI(title="Brightward Incident Triage", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "testserver"])


@app.middleware("http")
async def local_boundary(request: Request, call_next):
    if request.method == "POST":
        origin = request.headers.get("origin")
        if origin and urlsplit(origin).netloc != request.headers.get("host"):
            return JSONResponse({"detail": "Use this app from its local origin."}, status_code=403)
        try:
            size = int(request.headers.get("content-length", "0"))
        except ValueError:
            return JSONResponse({"detail": "Invalid request size."}, status_code=400)
        if size > 32000:
            return JSONResponse({"detail": "Incident input is too large."}, status_code=413)
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "no-store"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'"
    return response


class TriageRequest(BaseModel):
    incident: str = Field(min_length=10, max_length=12000)
    question: str = Field(default="What should I check next, and what evidence is needed before making a change?", min_length=3, max_length=2000)
    scenario: Literal['streaming', 'compute', 'database'] | None = None
    change_ids: list[str] = Field(default_factory=list, max_length=3)


class RelevanceRequest(BaseModel):
    evidence_id: str = Field(min_length=1, max_length=100)
    source: int = Field(ge=1, le=len(FILES))
    statement: str = Field(default="", max_length=12000)


@app.post("/api/source-relevance")
def source_relevance(body: RelevanceRequest):
    try:
        source, question = relevance.evidence(body.evidence_id, body.source)
        return relevance.explain(source, question, body.statement)
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from None
    except APIError:
        raise HTTPException(502, "Relevance explanation unavailable. Review the retrieved excerpts below.") from None


@app.get("/")
def home():
    return FileResponse(ROOT / "static" / "index.html")


@app.get("/api/status")
def status():
    key = False
    try:
        key = bool(settings.api_key())
        load_state(project_id=settings.PROJECT_ID)
        indexed = True
    except (ValueError, OSError, KeyError):
        indexed = False
    return {"ready": key and indexed, "label": "Ready for triage" if key and indexed else "Setup needed",
            "knowledge_count": len(catalog()), "api_configured": key, "ingestion_recorded": indexed,
            "backend": "responses", "agent_id": None}


@app.get("/api/sample")
def sample(scenario: str = "streaming"):
    samples = {
        "database": ("database-input.txt", "Why are catalog requests waiting for database connections despite moderate RDS CPU, and what evidence would distinguish pool pressure from long transactions?"),
        "streaming": ("incident-input.txt", "What should I check next, and what evidence is needed before changing CloudFront caching?"),
        "compute": ("compute-input.txt", "Which prior case is relevant, what should I check next, and what evidence is needed before making a change?"),
    }
    if scenario not in samples:
        raise HTTPException(404, "Unknown demo scenario.")
    filename, question = samples[scenario]
    return {"scenario": scenario, "incident": (DATA / "fixtures" / filename).read_text(), "question": question,
            "changes": get_changes(scenario)}


@app.get("/api/documents/{document_id}")
def document(document_id: str):
    for f in catalog().values():
        if f["document_id"] == document_id:
            return {**f, "content": (DATA / "knowledge" / f["filename"]).read_text()}
    raise HTTPException(404, "Document not in the approved corpus.")


@app.post("/api/triage")
def triage(body: TriageRequest):
    if not body.incident.strip() or not body.question.strip():
        raise HTTPException(422, "Add an incident and question first.")
    try:
        context = selected_change_context(body.scenario, body.change_ids)
        result, _ = generate(body.incident + context, body.question)
        result["evidence_id"] = relevance.remember(result, body.question)
        return result
    except ValueError as exc:
        raise HTTPException(422, str(exc)) from None
    except APIError:
        raise HTTPException(502, "OpenAI request failed. Check server-side API access, model availability, and quota; then retry.") from None
    except (OSError, KeyError):
        raise HTTPException(503, "Local setup is incomplete. Check the README and ingestion manifest.") from None


app.mount("/static", StaticFiles(directory=ROOT / "static"), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
