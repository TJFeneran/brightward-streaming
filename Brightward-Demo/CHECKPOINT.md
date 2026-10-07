# Folder migration - October 6, 2026

The workspace is `/home/tj/Documents/Brightward Streaming`; the app directory is `Brightward-Demo`. The virtual environment was rebuilt with the pinned Python 3.12.9 dependencies. Existing `northstar` commands, source IDs and ingestion state are preserved. The old app compatibility link and rollback environment were removed during approved cleanup. See the parent project brief for current status. All 14 tests, fish activation and real localhost startup/routes passed after the move. Reindexing is still required for the prior brand-content revision, not for this folder move.

# Brightward rename checkpoint - October 6, 2026

Current brand: Brightward Streaming, approved by TJ. Human-facing app and PDF/project copy, both corpus snapshots, fixtures and evaluation prompts are updated. Module/directory/manifest paths and source IDs remain compatible. The content change requires `python -m northstar.ingest --new-store` followed by a server restart. No live run is claimed for the renamed corpus.

The build has the rich Markdown source viewer, “Select Incident...” initial dropdown, and “Your operational knowledge. Clear next steps.” headline. Earlier source-view runs covered the prior named corpus. Formal five-case scoring and timed recording remain pending.

Verification after the rename: 11 backend tests and 3 Markdown-renderer tests passed. All five PDF pages were visually reviewed. Browser checks confirmed Brightward branding, the initial incident placeholder, and both sample loaders. Live retrieval against the renamed corpus remains pending.

## Earlier build evidence

# Local build checkpoint - October 6, 2026

Vector-store-first revision with two selectable incidents. The canonical project brief in the parent workspace is authoritative.

Completed: revised seven-document allowlist; compute runbook and historical case; shared evidence/ownership guidance; two fixture endpoints and UI selector; corpus migration preserving previous manifests and remote IDs; direct PDF presentation and synchronized narration; five model-evaluation cases with 20 criteria.

Verification: 11 offline Python tests passed in 0.44 seconds, with one upstream Starlette/httpx deprecation warning. Coverage includes malformed/incomplete citation rejection, exposure and manifest boundaries, scenario routes, and interrupted corpus migration followed by safe retries. Browser checks verified setup-needed state, disabled generation, both incident samples with their corresponding questions, and switching back. No live generated output was exercised during these checks.

Pending: revised-store ingestion using the key in TJ’s terminal, two real responses and source inspections, five model evaluations with actual evidence, latency/cost measurement, rehearsal and recording. Prior HTTP successes were for the old corpus. No API key was present in the agent process and no new remote store or generation is claimed.

Next: `python -m northstar.ingest --new-store`, restart the server, then inspect both cases. Keep the seven-document boundary and author-only key separation. The model is provisional; 30% faster correct triage is an unvalidated target. Regenerate submission ZIPs after validation, excluding secrets and local runtime state.

## Source inspection update

Rich Markdown rendering added for excerpts and full files, with inspectable metadata. Three JavaScript tests passed for formatting/provenance and blocked HTML, unsafe links and embedded images. Browser validation used the already-running, ready server and real compute responses; both the current compute runbook and historical case were retrieved. Excerpt/full-document rendering checked. Earlier statements above that all live runs are pending describe the initial build checkpoint; formal evaluation and remaining streaming validation are still pending. That earlier UI-only update needed no restart or reindex. The current Brightward corpus rename does require both.
