# Brightward - OpenAI vector store triage demo

A local advisory prototype featuring one OpenAI vector store across three Brightward incidents: frozen streaming playback, an unhealthy EC2 application with disk pressure, and RDS PostgreSQL connection pressure. The same retrieval and source-inspection workflow serves all three. No live telemetry or infrastructure actions.

**October 6 checkpoint:** restored the default Responses API/File Search flow at TJ's request. No saved Platform agent is selected or required. The existing API project, private key, ten-document store, three incidents and citation viewer are retained. Supplemental RDS observations and fictional change approval have been removed; missing evidence stays missing. Validation: 32 offline Python tests, three Markdown checks and a fresh live RDS brief with native citations passed. The six-case evaluation and timed rehearsal remain pending. There is no canned-answer fallback.

## Run locally

Requires Python 3.11+ and the configured OpenAI API project with billing, Responses API, vector-store access, and access to the configured model. Run these commands from the extracted `Brightward-Demo` folder. Do not serve the app on a public network.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

For fish, activate with `source .venv/bin/activate.fish` instead. Save the new project key through a hidden prompt, reindex and start:

```sh
python -m northstar.credentials
python -m northstar.ingest --new-project --new-store
python -m northstar.server
```

The key is saved with owner-only permissions in `.northstar/openai-api-key`, outside every served directory. It takes precedence over an existing `OPENAI_API_KEY` environment variable. Run `credentials` once or when rotating the key; never include `.northstar/` in source packages. Without a saved key, the app accepts `OPENAI_API_KEY`. `.env` files are not loaded.

Configuration lives in `northstar/settings.py`: project `proj_ZVeLEv0xHj4ZO6o5jVpWj1yO`, agent `agent_85dc53094758424c9153de65ab06688e0606e020571b47569d`. Ingestion first verifies access to that agent using the selected project header. Grant the backend only the permissions needed for agent sessions/model inference and knowledge retrieval; ingestion additionally needs file and vector-store creation. No Admin key, AWS credentials or GitHub token is used.

Open **http://127.0.0.1:8000** for the synthetic operations overview. Metrics and logs update every five seconds. The streaming alert is preloaded; the compute alert arrives after 15 active seconds and RDS connection pressure after 45 active seconds (20:16 UTC). **Pause simulation** freezes the replay, and **Replay** resets it. The eight-times replay clock aligns the October 6 incident snapshots; no live telemetry is connected. The inbox retains all three alerts without duplicate notifications. Hiding the browser tab pauses the replay.

Click **Investigate** on an alert to open the existing investigation with its incident type, notes and focus question already populated. Generation still requires an explicit click and API setup. Use **Operations Dashboard** to return without losing an in-progress draft. You can also open **http://127.0.0.1:8000/#triage** directly. The dropdown starts at **Select Incident...**. Select **Frozen live stream** to load its context and question, then choose **Generate triage brief**. Select **Unhealthy EC2 application** to load the second fixture and its question, then generate again. **RDS connection pressure** loads the database fixture and question. Open a numbered citation to see exact excerpts returned by vector-store search and, optionally, the full local knowledge document. Initial setup happens before recording, not while walking through the incident.

For **RDS connection pressure**, choose **Generate triage brief** as usual. Generation uses the original incident and its candidate GitHub PRs plus retrieved runbooks. Configuration, session/transaction, memory and impact gaps remain unknown until supplied by the engineer. No supplemental observation fixture, fictional approval or follow-up collection flow is attached. The database scenario and ten-document knowledge store are unchanged; no reindex is needed for this rollback.

Triage and passage explanations use Responses API with `gpt-5.4-mini` by default, overridable using `OPENAI_MODEL`. Each brief is an independent request with native File Search citations and `store=False`. The saved SRE agent integration and `BRIGHTWARD_BACKEND` selector have been removed; old shell values cannot reactivate it. Ingestion only verifies the selected project's knowledge store and does not require an agent.

The existing private project key and ingestion manifest remain valid. Start or restart the server, refresh the browser and generate a new brief. Existing briefs reflect their original context. Historical agent runs remain private under `.northstar/`; the app no longer creates agent sessions.

## What gets uploaded

`northstar/corpus.py` contains the exact ten-file allowlist under `data/knowledge/`. Ingestion uploads only those files to a dedicated vector store and records file IDs, metadata, and hashes in `.northstar/ingestion.json`. Re-running completed setup checks the store instead of uploading again. The manifest records its API project. `--new-project` archives a manifest from another project even when the corpus is unchanged; repeating it resumes/reuses the selected project and corpus. For a changed corpus, `--new-store` archives the old manifest and starts a clean store. Repeating this flag resumes/reuses a matching revision. It never deletes old remote resources; retain archived manifests for deliberate cleanup. Interrupted setup retains progress; a lost response between an upload and its local save can still leave an orphaned API resource.

`data/fixtures/`, `data/evaluation/`, and `data/author/` stay outside the vector store. The app serves only the allowlisted knowledge documents. The brief, board, answer key, evaluation criteria, and current hidden diagnosis are never sent as retrieval knowledge. Incident text and the question are sent to the API when the engineer generates a brief.

The packaged data is an exact snapshot of the completed Stage 2 source package. Edit that canonical package first if the scenario changes, then refresh this copy and rebuild its store. Do not silently diverge the copies.

The store has a seven-day inactivity expiration. That is not a promise that uploaded file objects are deleted. When finished, use the API dashboard or the SDK to delete this demo's vector store and the file IDs recorded in its manifest. Keep the manifest until cleanup is confirmed. API usage can incur charges; no cost has been measured yet.

## Five-minute recording budget

| Segment | Time | Show or explain |
| --- | --- | --- |
| Slide 1: situation | 0:00-0:30 | Brightward/on-call SRE and manual root-cause analysis |
| Slide 2: Platform and API | 0:30-1:10 | Vector Store, Agent, cited guidance and future remediation path |
| Complete demo, no slide | 1:10-4:00 | Platform/store and Agents 40 sec, then streaming/compute app 130 sec |
| Slide 3: value and guardrails | 4:00-4:35 | Unvalidated target, measurement, access/review and action controls |
| Slide 4: next steps and recap | 4:35-5:00 | Six-case validation, bounded pilot and gradual expansion |

The PDF has exactly four slides. All Platform and app clicks occur between slides 2 and 3, with no slide interruptions. Start the app on the paused Operations overview, click Investigate on the streaming alert, generate a real brief and inspect its citation. Then select compute, generate a brief and inspect its historical source. Keep the 2:40-3:15 streaming citation walkthrough. The 130-second app allocation remains 75 seconds streaming, 35 compute and 20 transitions/generation.

The Platform Agents example illustrates configurable instructions and tools. The local app calls Responses and File Search directly and has no saved-agent or remediation integration. Automated fixes are a future path requiring scoped tools, application-enforced permissions/approval policy, rollback and recovery checks. Rehearse real waits and use clearly labeled captures only for actual validated runs. Draft 7 has 434 spoken words; all timing is provisional. PDF and narration share the parent project's `presentation/content.json`; there is no HTML slide workflow.

## Implementation and verification

- Python/FastAPI serves a small HTML/CSS/JavaScript interface; credentials remain server-side. It binds to loopback only.
- Responses API is required to run File Search against the approved vector store. The server requires a completed response, successful search and native file citations backed by exact returned excerpts. Unknown or unsearched file references are rejected. Citation validation proves provenance, not semantic support.
- Each request checks that the remote store contains exactly the ten indexed files. This guards the ingestion boundary; it does not establish that every generated statement is supported. An engineer still reviews citations.
- The model sees current engineer input plus retrieved operational knowledge, with instructions to separate observations from hypotheses and avoid execution claims.
- The brief uses plain text and programmatically constructed elements. Source excerpts and full documents use a locally bundled Markdown renderer with raw HTML and images disabled, HTTP(S)-only links, and inspectable metadata. The app has no action tools, telemetry connector, authentication system, persistent conversation, or production readiness claim.
- `DESIGN.md` records the approved Aurora / Modern clarity implementation. `requirements-lock.txt` records the tested build environment; `requirements.txt` pins the three direct runtime dependencies.

To rerun local checks, install `pytest==9.1.1 httpx==0.28.1` in the venv and run `python -m pytest -q`. These tests use synthetic mocks and do not validate model quality. `tests/browser-check.cjs` and `tests/monitoring-check.cjs` require Node plus Playwright and Chromium and a server at port 8000; set `PLAYWRIGHT_MODULE` if the module is outside Node's default lookup path. The triage test explicitly labels its mocked output as a UI test. The monitoring test uses local sample endpoints and a controlled browser clock to check alert timing, pause/replay, both handoffs, navigation, failure recovery and responsive layouts; it asserts that no model requests occur. Run either with `node tests/<name>.cjs` after starting the local server.

After API setup, complete Stage 3 with real end-to-end runs for both incidents and inspect their citations. Then use `data/evaluation/cases.json` for Stage 4: each case is a fresh request; send only its incident and question. Never send the full case JSON, expectations, or author answer key. Record actual output, returned sources, rubric decisions, latency, model/configuration, token/tool usage, and measured cost or unavailable status. All 24 required criteria need human review; fixture construction is not a passed model evaluation.

Official integration references checked during the build: [File Search](https://developers.openai.com/api/docs/guides/tools-file-search), [Responses](https://developers.openai.com/api/reference/resources/responses/methods/create), and [Python SDK](https://github.com/openai/openai-python).

**Resume:** Read `Brightward-Project-Brief.md` first. It is the project's single source of truth; the project board is its derived status view. This README covers running the app, not a separate decision log.

Source Markdown checks: run `node tests/source-markdown.test.cjs` from the app folder. Three tests cover rich formatting, provenance, and inactive HTML/unsafe links/images. The source dialog was also checked against real retrieved compute evidence on October 6. The earlier Markdown-only update required a browser refresh. The Brightward rename below changes indexed documents and requires reindexing and a server restart.

## Brightward rename - October 6

Brightward Streaming is the approved fictional customer. The directory is now `Brightward-Demo`. The module `northstar`, `.northstar` manifests and `NS-*` identifiers remain stable for compatibility. Because indexed source text changed, stop the server, run `python -m northstar.ingest --new-store`, then restart. The prior corpus and remote IDs remain available through the archived manifest; no remote deletion occurs. New live validation is pending.

## Simulated GitHub changes

Loading an incident automatically includes its two candidate GitHub changes as supplemental context for the next brief. GitHub-related **Possible reasons** appear only in the generated output; there is no separate PR panel or selection step. Lower-relevance records are excluded. Switching incidents or a failed sample load clears the previous change context.

This is local simulated API data carried in `/api/sample`, not a live GitHub connection or MCP integration. Fixtures live in `Stage-2/fixtures/github-changes.json` and the matching app data snapshot, outside the ten-file knowledge allowlist. The server validates PR IDs against the incident before passing their records to generation. The brief begins each GitHub-based reason with GitHub PR #number (repository) and shows a GitHub PRs source badge. The global demo label provides simulation context without repeating it in every reason. Changes remain hypotheses, and the model must not claim a live GitHub query. Validated knowledge citations remain tied to operational documents.

The panel removal is frontend-only: refresh the browser; no server restart or reindex is needed. A live streaming brief was observed naming PRs 142 and 139 as possible contributors, with deployment/runtime caveats. Full evaluation and live compute verification remain separate tasks.

`tests/changes-check.cjs` verifies the absence of the panel, automatic candidate IDs for both scenarios, possible-reasons rendering, stale-context clearing and mobile width using mocked model output. Browser scripts accept `BASE_URL` (default `http://127.0.0.1:8000`).

For the GitHub attribution wording update, restart the Python server, refresh, and generate a new brief. Existing generated text does not change retroactively. No reindex is needed.

## Semantic relevance in source inspection

Click a numbered citation to see the selected statement, **Why this passage is relevant**, and a subtle highlight on a supporting passage in the retrieved excerpt. The same passage is highlighted and brought into view when opening the full document. Source-list buttons assess relevance to the original focus question. The explanation connects meaning (for example, frozen playback despite successful HTTP requests to a runbook about timeline freshness), rather than ranking shared words.

Responses API retrieves evidence through native File Search during brief generation. Opening a citation makes an additional Responses API call to select one verbatim passage and explain its relationship to that statement. This is a model assessment of returned evidence, not the retriever's internal rationale or a similarity score. The server checks the quote against the exact original excerpts; unsupported claims display an evidence gap, and failures leave the excerpts readable. Quote verification proves textual provenance, not the correctness of the explanation; inspect both during live rehearsal.

Successful explanations and pending requests are reused per source/statement within the current brief in the browser. The server retains up to 32 briefs in memory with a one-hour lookup lifetime; restarting the server invalidates those references. Incident text is not retained in that cache. The additional call uses the configured model, original question, selected statement and that source's retrieved excerpts, and can incur API usage. No new ingestion, GitHub access or action tools are involved.

Restart the Python server, refresh the page and generate a new brief to use this feature. No reindex is needed. Verification: 22 offline Python tests, three Markdown tests, the existing three browser suites and `tests/relevance-check.cjs` passed. Desktop/mobile screenshots were reviewed. Relevance responses were mocked; live model explanation quality is not yet evaluated.

## RDS database incident

The third scenario is **RDS connection pressure**: catalog requests wait for database connections despite moderate CPU. The dashboard adds RDS connections and catalog pool acquisition p95, rising to 492 sessions and 2600 ms at the 45-second alert. Logs include replica growth, acquisition timeouts and a connection-slot rejection. Investigate pre-populates the database incident and question.

The ten-file allowlist adds `NS-RB-006` (connection diagnosis), `NS-RB-007` (change/recovery review) and `NS-INC-005` (historical replica/pool fan-out), and updates database ownership in `NS-OWN-001`. The canonical Stage-2 files and app snapshot match. GitHub PR 318 proposes a larger application pool; PR 311 could prolong worker transactions. Both are candidate explanations, with deployment and current session evidence explicitly unverified. Staging-only PR 316 is excluded from generation.

This corpus upgrade **requires reindexing**. Stop the existing server with Ctrl+C, then run in the app directory and the terminal that already has your API key:

```sh
.venv/bin/python -m northstar.ingest --new-store
.venv/bin/python -m northstar.server
```

Refresh the browser and generate a new brief. The migration preserves prior store/file IDs in an archived manifest; it does not delete old remote resources. That earlier work session had no API key. The current checkpoint above supersedes its ingestion/backend status. The evaluation set now has six cases and 24 criteria, including the database case; it remains unrun. The five-minute recording plan still selects two cases and needs its corpus-count wording reconciled before recording.

Verification: 24 Python tests, three Markdown tests and all four browser suites; mocked model responses only. RDS alert timing, metrics/log alignment, all three handoffs, scenario-specific PR payloads, corpus snapshot equality, ten distinct document IDs, seven-to-ten migration behavior and desktop/mobile layout were checked.
