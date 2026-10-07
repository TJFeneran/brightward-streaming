"""Local simulated GitHub API evidence; never ingested into the vector store."""
import json
from .corpus import DATA


def get_changes(scenario):
    fixtures = json.loads((DATA / 'fixtures' / 'github-changes.json').read_text())
    if scenario not in fixtures:
        raise ValueError('Unknown demo scenario for GitHub changes.')
    return fixtures[scenario]


def selected_change_context(scenario, change_ids):
    if not change_ids:
        return ''
    changes = {c['id']: c for c in get_changes(scenario)}
    if len(change_ids) != len(set(change_ids)) or any(id not in changes for id in change_ids):
        raise ValueError('Select GitHub changes from the current incident only.')
    selected = [changes[id] for id in change_ids]
    return ('\n\nSupplemental GitHub change evidence — SIMULATED API FIXTURES, not a live GitHub query. '
            'These are candidate explanations, not verified causes or effective runtime settings. '
            'Merge and deployment evidence are distinct. Use repository and PR number for attribution; '
            'these records are not File Search sources.\n' + json.dumps(selected, ensure_ascii=False, indent=2))
