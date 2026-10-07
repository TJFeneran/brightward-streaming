import pytest
from northstar import settings


@pytest.fixture(autouse=True)
def isolated_credentials(monkeypatch, tmp_path):
    monkeypatch.setattr(settings, "KEY_FILE", tmp_path / "api-key")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
