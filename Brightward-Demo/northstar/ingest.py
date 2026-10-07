"""Explicit, resumable setup. Never called automatically by app startup."""
import argparse
import hashlib
import json
from .corpus import DATA, FILES, STATE, catalog, load_state, write_state
from . import settings


def ingest(client, *, new_store=False, project_id=None, new_project=False):
    current = catalog()
    if STATE.exists():
        state = json.loads(STATE.read_text())
        project_changed = project_id is not None and state.get("project_id") != project_id
        if project_changed and not new_project:
            raise ValueError("API project changed. Run python -m northstar.ingest --new-project --new-store.")
        if project_changed or (state.get("catalog") != current and new_store):
            # Retain the old IDs for audit/cleanup. Retrying this flag against the
            # current catalog resumes/reuses the new store rather than creating another.
            backup = STATE.with_name("ingestion-archived-" + hashlib.sha256(STATE.read_bytes()).hexdigest()[:16] + ".json")
            if not backup.exists():
                backup.write_bytes(STATE.read_bytes())
                backup.chmod(0o600)
            state = {"status": "uploading", "catalog": current, "files": [], "project_id": project_id}
            write_state(state)
            print("Previous manifest archived; previous remote resources retained.")
        elif state.get("catalog") != current:
            raise ValueError("Corpus changed. Run python -m northstar.ingest --new-store to index this revision.")
        if state.get("status") == "ready":
            state = load_state(project_id=project_id)
            remote = list(client.vector_stores.files.list(vector_store_id=state["vector_store_id"]))
            if {f.id for f in remote} != {f["file_id"] for f in state["files"]} or any(f.status != "completed" for f in remote):
                raise ValueError("Remote store does not match the completed local manifest.")
            print(f"{len(FILES)}-file store already ready; no uploads made.")
            return
        if state.get("catalog") != current:
            raise ValueError("Files changed during incomplete ingestion. Resolve the stored setup before retrying.")
    else:
        state = {"status": "uploading", "catalog": current, "files": [], "project_id": project_id}
        write_state(state)
    # Persist each ID immediately so normal retries reuse completed work.
    if not state.get("vector_store_id"):
        store = client.vector_stores.create(
            name=f"Brightward synthetic triage — {len(FILES)} approved source files",
            expires_after={"anchor": "last_active_at", "days": 7},
        )
        state["vector_store_id"] = store.id
        write_state(state)
    uploaded = {f["filename"]: f for f in state["files"]}
    for name in FILES:
        if name in uploaded:
            continue
        with (DATA / "knowledge" / name).open("rb") as stream:
            file = client.files.create(file=stream, purpose="assistants")
        state["files"].append({**current[name], "file_id": file.id})
        write_state(state)
        print(f"Uploaded {current[name]['document_id']}")
    attached = {f.id for f in client.vector_stores.files.list(vector_store_id=state["vector_store_id"])}
    for item in state["files"]:
        if item["file_id"] not in attached:
            result = client.vector_stores.files.create_and_poll(
                vector_store_id=state["vector_store_id"], file_id=item["file_id"],
                attributes={"document_id": item["document_id"], "approval_status": item["status"]},
            )
        else:
            result = client.vector_stores.files.poll(item["file_id"], vector_store_id=state["vector_store_id"])
        if result.status != "completed":
            raise ValueError(f"Indexing not complete for {item['document_id']}: {result.status}")
    remote = list(client.vector_stores.files.list(vector_store_id=state["vector_store_id"]))
    if {f.id for f in remote} != {f["file_id"] for f in state["files"]}:
        raise ValueError("Unexpected files in store; setup not marked ready.")
    state["status"] = "ready"
    write_state(state)
    print(f"Ready: {len(FILES)} documents indexed. Start the app with python -m northstar.server.")


def main():
    parser = argparse.ArgumentParser(description="Upload only the allowlisted synthetic knowledge documents.")
    parser.add_argument("--new-store", action="store_true", help="Archive an outdated manifest and index the revised corpus; reuse/resume a matching revision.")
    parser.add_argument("--new-project", action="store_true", help="Archive the old project's manifest and index in the configured Brightward project; retries resume it.")
    args = parser.parse_args()
    try:
        with settings.client(timeout=90.0) as client:
            ingest(client, new_store=args.new_store, new_project=args.new_project,
                   project_id=settings.PROJECT_ID)
    except ValueError as exc:
        print(f"Setup stopped: {exc}")
        raise SystemExit(1) from None
    except Exception as exc:
        # Do not print upstream payloads or authorization details.
        print(f"Setup stopped ({type(exc).__name__}). Local progress is retained in .northstar/ingestion.json.")
        raise SystemExit(1) from None


if __name__ == "__main__":
    main()
