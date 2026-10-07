import json
from types import SimpleNamespace

import pytest

from northstar import corpus, ingest, settings


@pytest.fixture
def state(monkeypatch, tmp_path):
    path = tmp_path / "ingestion.json"
    monkeypatch.setattr(corpus, "STATE", path)
    monkeypatch.setattr(ingest, "STATE", path)
    value = {"status": "ready", "project_id": settings.PROJECT_ID,
             "catalog": corpus.catalog(), "vector_store_id": "vs-new", "files": [
                 {**f, "file_id": f"file-{i}"} for i, f in enumerate(corpus.catalog().values())]}
    corpus.write_state(value)
    return value



def test_project_switch_archives_same_corpus_and_retries_resume(state):
    old = {**state, "project_id": "proj-old", "vector_store_id": "vs-old"}
    corpus.write_state(old)
    created, uploaded, attached = [], [], []
    def create(**kwargs):
        created.append(True)
        return SimpleNamespace(id="vs-new")
    def upload(**kwargs):
        uploaded.append(kwargs["file"].name)
        return SimpleNamespace(id=f"new-{len(uploaded)}")
    def attach(**kwargs):
        attached.append(SimpleNamespace(id=kwargs["file_id"], status="completed"))
        return attached[-1]
    client = SimpleNamespace(vector_stores=SimpleNamespace(create=create, files=SimpleNamespace(
        list=lambda **_: attached, create_and_poll=attach)), files=SimpleNamespace(create=upload))
    with pytest.raises(ValueError, match="--new-project"):
        ingest.ingest(client, project_id=settings.PROJECT_ID, new_store=True)
    assert not created and not uploaded
    for _ in range(2):
        ingest.ingest(client, project_id=settings.PROJECT_ID, new_project=True, new_store=True)
    assert len(created) == 1 and len(uploaded) == len(corpus.FILES)
    assert corpus.load_state(project_id=settings.PROJECT_ID)["vector_store_id"] == "vs-new"
    backups = list(corpus.STATE.parent.glob("ingestion-archived-*.json"))
    assert len(backups) == 1 and json.loads(backups[0].read_text()) == old


def test_other_project_manifest_cannot_be_used(state):
    corpus.write_state({**state, "project_id": "proj-old"})
    with pytest.raises(ValueError, match="another API project"):
        corpus.load_state(project_id=settings.PROJECT_ID)


def test_local_key_is_private_and_precedes_stale_environment(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "old-test-key")
    settings.KEY_FILE.write_text("new-test-key\n")
    settings.KEY_FILE.chmod(0o600)
    assert settings.api_key() == "new-test-key"
    settings.KEY_FILE.chmod(0o644)
    with pytest.raises(ValueError, match="private"):
        settings.api_key()


def test_ingestion_setup_needs_no_saved_agent(monkeypatch):
    from contextlib import nullcontext
    client = object()
    calls = []
    monkeypatch.setattr(settings, 'client', lambda **_: nullcontext(client))
    monkeypatch.setattr(ingest, 'ingest', lambda actual, **kwargs: calls.append((actual, kwargs)))
    monkeypatch.setattr('sys.argv', ['northstar.ingest'])
    ingest.main()
    assert calls == [(client, {'new_store': False, 'new_project': False, 'project_id': settings.PROJECT_ID})]
