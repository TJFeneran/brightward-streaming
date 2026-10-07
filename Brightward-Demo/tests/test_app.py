import copy
import json
from types import SimpleNamespace
import pytest
from fastapi.testclient import TestClient
from northstar import corpus, settings, triage
from northstar.server import app


@pytest.fixture
def state(monkeypatch, tmp_path):
    monkeypatch.setattr(corpus, 'STATE', tmp_path / 'ingestion.json')
    value = {'status': 'ready', 'project_id': settings.PROJECT_ID, 'catalog': corpus.catalog(), 'vector_store_id': 'vs-test', 'files': [
        {**f, 'file_id': f'file-{i}'} for i, f in enumerate(corpus.catalog().values())]}
    corpus.write_state(value)
    return value


def response(state):
    fid = state['files'][0]['file_id']
    return {'status': 'completed', 'id': 'resp-test', 'model': 'test-only', 'output': [
        {'type': 'file_search_call', 'status': 'completed', 'results': [
            {'file_id': fid, 'text': 'Compare repeated CDN and authorized origin samples.'}]},
        {'type': 'message', 'content': [{'type': 'output_text', 'text': 'Compare progression.',
            'annotations': [{'type': 'file_citation', 'file_id': fid, 'index': 20}]}]}]}


def test_native_citations_require_exact_returned_chunks(state):
    raw = response(state)
    result = triage.extract_response(raw, state)
    assert result['sources'][0]['document_id'] == 'NS-RB-001'
    assert result['sources'][0]['excerpts'] == [raw['output'][0]['results'][0]['text']]
    raw['output'][0]['results'] = []
    with pytest.raises(ValueError, match='inspectable'): triage.extract_response(raw, state)


@pytest.mark.parametrize('mutation', ['unknown_file', 'incomplete', 'no_search', 'no_citation', 'bad_offset'])
def test_invalid_outputs_are_not_presented_as_success(state, mutation):
    raw = response(state)
    if mutation == 'unknown_file': raw['output'][0]['results'][0]['file_id'] = 'file-outside-corpus'
    if mutation == 'incomplete': raw['status'] = 'incomplete'
    if mutation == 'no_search': raw['output'] = raw['output'][1:]
    if mutation == 'no_citation': raw['output'][1]['content'][0]['annotations'] = []
    if mutation == 'bad_offset': raw['output'][1]['content'][0]['annotations'][0]['index'] = 999
    with pytest.raises(ValueError): triage.extract_response(raw, state)


def test_changed_knowledge_invalidates_manifest(state):
    changed = copy.deepcopy(state); changed['files'][0]['sha256'] = 'changed'
    corpus.write_state(changed)
    with pytest.raises(ValueError, match='changed'): corpus.load_state()


def test_only_allowlisted_source_files_are_exposed(monkeypatch):
    monkeypatch.delenv('OPENAI_API_KEY', raising=False)
    client = TestClient(app)
    assert len(corpus.catalog()) == 10
    assert client.get('/api/documents/NS-RB-001').status_code == 200
    for path in ['/api/documents/ground-truth', '/data/author/ground-truth.md', '/static/../data/author/ground-truth.md']:
        assert client.get(path).status_code == 404
    assert client.get('/api/sample').json()['incident'] == (corpus.DATA / 'fixtures/incident-input.txt').read_text()
    status = client.get('/api/status').json()
    assert status['ready'] is False
    assert status['backend'] == 'responses' and status['agent_id'] is None
    blocked = client.post('/api/triage', json={'incident': 'Synthetic test incident'})
    assert blocked.status_code == 422 and 'API setup' in blocked.json()['detail']
    assert client.post('/api/triage', headers={'origin': 'https://outside.example'}, json={'incident': 'Synthetic test incident'}).status_code == 403


@pytest.mark.parametrize('old_backend', [None, 'agents', 'responses'])
def test_generation_requests_real_search_without_evaluator_content(state, monkeypatch, old_backend):
    if old_backend is None:
        monkeypatch.delenv('BRIGHTWARD_BACKEND', raising=False)
    else:
        monkeypatch.setenv('BRIGHTWARD_BACKEND', old_backend)
    monkeypatch.delenv('OPENAI_MODEL', raising=False)
    class Responses:
        def create(self, **kwargs):
            assert kwargs['include'] == ['file_search_call.results']
            assert kwargs['tool_choice'] == {'type': 'file_search'}
            assert kwargs['tools'][0]['vector_store_ids'] == ['vs-test']
            assert kwargs['store'] is False
            assert kwargs['model'] == 'gpt-5.4-mini'
            assert '300' not in kwargs['instructions'] + kwargs['input']
            return SimpleNamespace(model_dump=lambda **_: response(state))
    files = SimpleNamespace(list=lambda **_: [SimpleNamespace(id=f['file_id'], status='completed') for f in state['files']])
    client = SimpleNamespace(responses=Responses(), vector_stores=SimpleNamespace(files=files))
    result, _ = triage.generate('Playback freezes.', 'What next?', client=client)
    assert result['search_calls'] == 1
    files.list = lambda **_: [SimpleNamespace(id='file-unapproved', status='completed')]
    with pytest.raises(ValueError, match='differs'): triage.generate('Playback freezes.', 'What next?', client=client)


def test_scenarios_have_distinct_context_and_questions():
    client = TestClient(app)
    stream = client.get('/api/sample?scenario=streaming').json()
    compute = client.get('/api/sample?scenario=compute').json()
    assert stream['scenario'] == 'streaming' and 'CloudFront' in stream['question']
    assert compute['scenario'] == 'compute' and 'ns-session-42' in compute['incident']
    assert 'prior case' in compute['question']
    assert 'Unknown:' in compute['incident']
    assert stream['incident'] != compute['incident']
    assert client.get('/api/sample?scenario=../../author/ground-truth').status_code == 404
    assert client.get('/api/documents/NS-RB-004').status_code == 200
    assert client.get('/api/documents/NS-INC-004').status_code == 200


def test_corpus_upgrade_is_explicit_resumable_and_preserves_old_ids(monkeypatch, tmp_path):
    from northstar import ingest
    path = tmp_path / 'ingestion.json'
    monkeypatch.setattr(corpus, 'STATE', path)
    monkeypatch.setattr(ingest, 'STATE', path)
    old = {'status': 'ready', 'catalog': {'old': {}}, 'vector_store_id': 'vs-old',
           'files': [{'filename': 'old', 'file_id': 'file-old'}]}
    corpus.write_state(old)
    created, uploads, attached = [], [], []
    def create_store(**kwargs):
        created.append(kwargs)
        return SimpleNamespace(id='vs-new')
    def upload(**kwargs):
        uploads.append(kwargs['file'].name)
        return SimpleNamespace(id=f'file-new-{len(uploads)}')
    def attach(**kwargs):
        assert kwargs['vector_store_id'] == 'vs-new'
        attached.append(SimpleNamespace(id=kwargs['file_id'], status='completed'))
        return attached[-1]
    files = SimpleNamespace(list=lambda **_: attached, create_and_poll=attach)
    client = SimpleNamespace(vector_stores=SimpleNamespace(create=create_store, files=files),
                             files=SimpleNamespace(create=upload))
    with pytest.raises(ValueError, match='--new-store'):
        ingest.ingest(client)
    assert not created and not uploads and json.loads(path.read_text()) == old
    # Fail after some uploads to prove the new manifest is retained and resumed.
    real_upload = client.files.create
    def interrupt_upload(**kwargs):
        if len(uploads) == 2:
            raise RuntimeError('simulated interrupted upload')
        return real_upload(**kwargs)
    client.files.create = interrupt_upload
    with pytest.raises(RuntimeError):
        ingest.ingest(client, new_store=True)
    assert len(created) == 1 and len(uploads) == 2
    client.files.create = real_upload
    ingest.ingest(client, new_store=True)
    ingest.ingest(client, new_store=True)
    assert len(created) == 1 and len(uploads) == 10 and len(attached) == 10
    assert corpus.load_state()['vector_store_id'] == 'vs-new'
    backups = list(tmp_path.glob('ingestion-archived-*.json'))
    assert len(backups) == 1 and json.loads(backups[0].read_text()) == old
    assert all('/knowledge/' in p for p in uploads)


def test_simulated_changes_are_scenario_scoped_and_outside_knowledge():
    from northstar.changes import selected_change_context
    client = TestClient(app)
    streaming = client.get('/api/sample?scenario=streaming').json()['changes']
    compute = client.get('/api/sample?scenario=compute').json()['changes']
    assert len(streaming) == len(compute) == 3
    assert {c['id'] for c in streaming}.isdisjoint(c['id'] for c in compute)
    assert all(c['diff'] and c['verify'] and c['deployment'] for c in streaming + compute)
    assert selected_change_context(None, []) == ''
    assert len(corpus.catalog()) == 10
    assert (corpus.DATA / 'fixtures/github-changes.json').read_bytes() == (corpus.ROOT.parent / 'Stage-2/fixtures/github-changes.json').read_bytes()


def test_only_selected_change_evidence_reaches_generation(monkeypatch):
    import northstar.server as server
    captured = []
    def fake_generate(incident, question):
        captured.append((incident, question))
        return {'text': 'UI test only'}, {}
    monkeypatch.setattr(server, 'generate', fake_generate)
    client = TestClient(app)
    body = {'incident': 'Synthetic EC2 incident', 'question': 'What next?', 'scenario': 'compute', 'change_ids': ['compute-287']}
    assert client.post('/api/triage', json=body).status_code == 200
    assert 'SIMULATED API FIXTURES' in captured[0][0]
    assert 'LOG_LEVEL=debug' in captured[0][0]
    assert 'compute-284' not in captured[0][0] and 'streaming-142' not in captured[0][0]
    for bad_ids in [['streaming-142'], ['unknown'], ['compute-287', 'compute-287']]:
        assert client.post('/api/triage', json={**body, 'change_ids': bad_ids}).status_code == 422
    assert client.post('/api/triage', json={**body, 'scenario': None}).status_code == 422
    assert len(captured) == 1
    assert client.post('/api/triage', json={**body, 'change_ids': []}).status_code == 200
    assert captured[-1][0] == body['incident']


def test_database_scenario_documents_and_change_boundary(monkeypatch):
    import northstar.server as server
    client = TestClient(app)
    sample = client.get('/api/sample?scenario=database').json()
    assert '20:16 UTC' in sample['incident'] and '492' in sample['incident']
    assert 'RDS CPU' in sample['question']
    assert [c['id'] for c in sample['changes'] if c['relevance'] == 'Possible contributor'] == ['database-318', 'database-311']
    for document_id, title in [('NS-RB-006', 'RDS PostgreSQL connection pressure'), ('NS-RB-007', 'RDS and application pool'), ('NS-INC-005', 'Catalog timeouts')]:
        response = client.get(f'/api/documents/{document_id}')
        assert response.status_code == 200 and response.json()['title'].startswith(title)
    assert len({f['document_id'] for f in corpus.catalog().values()}) == 10
    for folder in ['knowledge', 'fixtures', 'evaluation', 'author']:
        for path in (corpus.DATA / folder).iterdir():
            if path.is_file():
                assert path.read_bytes() == (corpus.ROOT.parent / 'Stage-2' / folder / path.name).read_bytes()
    captured = []
    def fake_generate(incident, question):
        captured.append(incident)
        return {'text': 'Test only', 'sources': []}, {}
    monkeypatch.setattr(server, 'generate', fake_generate)
    body = {'incident': sample['incident'], 'question': sample['question'], 'scenario': 'database', 'change_ids': ['database-318', 'database-311']}
    assert client.post('/api/triage', json=body).status_code == 200
    assert 'DB_POOL_MAX' in captured[0] and 'upload_export' in captured[0]
    assert 'database-316' not in captured[0]
    assert client.post('/api/triage', json={**body, 'change_ids': ['compute-287']}).status_code == 422


def test_seven_document_manifest_requests_explicit_upgrade(state):
    old = copy.deepcopy(state)
    old['files'] = old['files'][:7]
    old['catalog'] = {f['filename']: old['catalog'][f['filename']] for f in old['files']}
    corpus.write_state(old)
    with pytest.raises(ValueError, match='--new-store'):
        corpus.load_state()
