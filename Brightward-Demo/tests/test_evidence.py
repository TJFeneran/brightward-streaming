"""Database unknowns must not be filled with fabricated follow-up observations."""
from fastapi.testclient import TestClient
from northstar import corpus, server
from northstar.changes import selected_change_context


def test_database_unknowns_and_original_scenario_remain():
    client = TestClient(server.app)
    sample = client.get('/api/sample?scenario=database').json()
    assert 'Unknown:' in sample['incident']
    assert len(corpus.catalog()) == 10
    for data in [corpus.DATA, corpus.ROOT.parent / 'Stage-2']:
        assert not (data / 'fixtures/database-evidence.json').exists()
    assert client.get('/api/documents/database-follow-up').status_code == 404
    assert client.get('/api/simulated-evidence?scenario=database').status_code == 404


def test_generation_uses_only_supplied_incident_and_selected_prs(monkeypatch):
    captured = []
    def generate(incident, question):
        captured.append(incident)
        return {'text': 'Test only', 'sources': []}, {}
    monkeypatch.setattr(server, 'generate', generate)
    client = TestClient(server.app)
    for scenario in ['database', 'compute', 'streaming', None, 'database']:
        body = {'incident': 'Synthetic incident context', 'question': 'What next?', 'scenario': scenario}
        if scenario == 'database':
            body['change_ids'] = ['database-318', 'database-311']
        response = client.post('/api/triage', json=body)
        assert response.status_code == 200
        assert 'includes_database_evidence' not in response.json()
        assert captured[-1] == body['incident'] + selected_change_context(scenario, body.get('change_ids', []))
        for fabricated in ['RDS-CONFIG', 'RDS-SESSIONS', 'RDS-MEMORY', 'RDS-IMPACT', 'RDS-CHANGE-REVIEW', 'DEMO-CHG-042']:
            assert fabricated not in captured[-1]
    body = {'incident': 'Database context with unknown settings.', 'question': 'What next?', 'scenario': 'database'}
    assert client.post('/api/triage', json=body).status_code == 200
    assert captured[-1] == body['incident']
