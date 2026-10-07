"""The ingestion boundary is an explicit allowlist, never a glob."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
STATE = ROOT / ".northstar" / "ingestion.json"
FILES = (
    "01-playlist-freshness.md", "02-compute-disk-pressure.md",
    "03-cdn-change-safety.md", "04-incident-playlist-cache.md",
    "05-incident-log-rotation.md", "06-evidence-and-precedent.md",
    "07-ownership-escalation.md", "08-rds-connection-pressure.md",
    "09-rds-change-safety.md", "10-incident-rds-pool-fanout.md",
)


def catalog():
    result = {}
    for name in FILES:
        path = DATA / "knowledge" / name
        if path.is_symlink() or not path.is_file():
            raise ValueError(f"Missing or symlinked corpus file: {name}")
        content = path.read_text(encoding="utf-8")
        meta = dict(line.split(": ", 1) for line in content.split("---", 2)[1].splitlines() if ": " in line)
        result[name] = {
            "filename": name, "document_id": meta["id"], "title": meta["title"],
            "version": meta["version"], "owner": meta["owner"],
            "status": meta["approval_status"],
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        }
    if len({f["document_id"] for f in result.values()}) != len(result):
        raise ValueError("Knowledge document IDs must be unique.")
    return result


def load_state(*, project_id=None):
    if not STATE.exists():
        raise ValueError("Run python -m northstar.ingest before generating a brief.")
    state = json.loads(STATE.read_text())
    if project_id and state.get("project_id") != project_id:
        raise ValueError("Knowledge belongs to another API project. Run python -m northstar.ingest --new-project --new-store.")
    current = catalog()
    if state.get("catalog") != current:
        raise ValueError("Knowledge corpus changed. Run python -m northstar.ingest --new-store.")
    if state.get("status") != "ready" or len(state.get("files", [])) != len(FILES):
        raise ValueError("Ingestion is incomplete. Run python -m northstar.ingest.")
    if {f["filename"] for f in state["files"]} != set(FILES):
        raise ValueError("Ingestion contains an unexpected file. Run python -m northstar.ingest --new-store.")
    if len({f["file_id"] for f in state["files"]}) != len(FILES):
        raise ValueError("Ingestion file IDs are not unique.")
    for f in state["files"]:
        if f["sha256"] != current[f["filename"]]["sha256"]:
            raise ValueError("Knowledge files changed after ingestion. Run python -m northstar.ingest --new-store.")
    return state


def write_state(state):
    STATE.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    temporary = STATE.with_suffix(".tmp")
    temporary.write_text(json.dumps(state, indent=2) + "\n")
    temporary.chmod(0o600)
    temporary.replace(STATE)
