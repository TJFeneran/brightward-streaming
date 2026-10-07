import json
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient
from northstar import relevance, server

PASSAGE = 'HTTP 200 establishes that a response was served. It does not establish that the live timeline advanced.'
SOURCE = {'number': 1, 'title': 'Playlist freshness', 'excerpts': [PASSAGE]}


def fake_client(value, status='completed'):
    def create(**kwargs):
        assert kwargs['text']['format']['strict'] is True
        assert kwargs['store'] is False
        assert 'tools' not in kwargs
        assert json.loads(kwargs['input'])['excerpts'] == [PASSAGE]
        return SimpleNamespace(status=status, output_text=json.dumps(value))
    return SimpleNamespace(responses=SimpleNamespace(create=create))


def test_semantic_explanation_keeps_exact_retrieved_quote():
    value = {'relevant': True, 'quote': PASSAGE, 'explanation': 'A successful request can still contain an old playlist, so frozen playback requires a progression check.'}
    assert relevance.explain(SOURCE, 'What next?', 'Viewers are stuck despite successful requests.', fake_client(value)) == value


@pytest.mark.parametrize('value', [
    {'relevant': True, 'quote': 'The deployed cache policy caused this incident.', 'explanation': 'Invented.'},
    {'relevant': True, 'quote': 'HTTP 200', 'explanation': 'Too short.'},
    {'relevant': False, 'quote': PASSAGE, 'explanation': 'Should not highlight.'},
    {'relevant': True, 'quote': PASSAGE, 'explanation': ''},
    {},
])
def test_unverified_passages_are_rejected(value):
    with pytest.raises(ValueError, match='verified'):
        relevance.explain(SOURCE, 'What next?', '', fake_client(value))


def test_insufficient_evidence_and_incomplete_response():
    value = {'relevant': False, 'quote': '', 'explanation': 'The excerpt does not establish whether this PR was deployed.'}
    assert relevance.explain(SOURCE, 'Was the PR deployed?', '', fake_client(value)) == value
    with pytest.raises(ValueError, match='did not complete'):
        relevance.explain(SOURCE, 'What next?', '', fake_client(value, 'incomplete'))


def test_endpoint_uses_server_retained_evidence_and_expires(monkeypatch):
    token = relevance.remember({'sources': [SOURCE]}, 'Original question')
    seen = []
    def explain(source, question, statement):
        seen.append((source, question, statement))
        return {'relevant': True, 'quote': PASSAGE, 'explanation': 'UI test only'}
    monkeypatch.setattr(relevance, 'explain', explain)
    client = TestClient(server.app)
    body = {'evidence_id': token, 'source': 1, 'statement': 'Frozen playback', 'excerpts': ['Fabricated evidence']}
    assert client.post('/api/source-relevance', json=body).status_code == 200
    assert seen == [(SOURCE, 'Original question', 'Frozen playback')]
    assert client.post('/api/source-relevance', json={**body, 'source': 2}).status_code == 422
    assert client.post('/api/source-relevance', json={**body, 'evidence_id': 'invented'}).status_code == 422
    now = relevance.time.monotonic()
    monkeypatch.setattr(relevance.time, 'monotonic', lambda: now + relevance.TTL + 1)
    expired = client.post('/api/source-relevance', json=body)
    assert expired.status_code == 422 and 'expired' in expired.json()['detail']
    assert len(seen) == 1


def test_retained_briefs_are_bounded(monkeypatch):
    monkeypatch.setattr(relevance, 'MAX_BRIEFS', 2)
    first = relevance.remember({'sources': [SOURCE]}, 'One')
    relevance.remember({'sources': [SOURCE]}, 'Two')
    last = relevance.remember({'sources': [SOURCE]}, 'Three')
    with pytest.raises(ValueError, match='expired'):
        relevance.evidence(first, 1)
    assert relevance.evidence(last, 1)[1] == 'Three'
