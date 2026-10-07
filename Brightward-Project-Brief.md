# Brightward: OpenAI vector store demo

Authoritative local project brief. Updated October 7, 2026, America/New_York. TJ's four-slide flow below supersedes the earlier five-slide presentation. Brightward Streaming remains approved; TJ's latest request also adds an animated fslides version. The board is a derived summary; if it differs, follow this brief.

## Resume here

### TJ’s timed script and GitHub sync, October 7

The current presenter script is revision 8, authored by TJ in his natural speaking
tone. TJ reported a stopwatch rehearsal just under five minutes. Its segment
labels total **4:51 (291 seconds)**: slides 1 and 2 take 48 and 47 seconds, the app
walkthrough takes 93 seconds (34 + 59), Platform Agents takes 35 seconds, and
slides 3 and 4 take 39 and 29 seconds. These labels leave nine seconds against the
five-minute limit; cumulative windows derive from the supplied labels.

The app walkthrough now precedes the Platform walkthrough, entirely between
slides 2 and 3. The timed app segment uses streaming; compute and RDS remain
available and covered by the six-case evaluation. The script calls the fictional
customer “Brightward Media”; the repository/app compatibility names remain
Brightward Streaming. Preserve TJ’s wording, including his chosen GitHub line.
The actual implementation still uses simulated PR fixtures and Responses/File
Search directly; the Platform Agent is illustrative and no live connector or
remediation capability was added.

`presentation/content.json`, the generated narration, the plain-text
`Brightward-Speaking-Script.txt` and all four fslides notes now share the approved
script. The existing user-edited slide copy and faster alert replay are retained.
The original PDF is preserved from draft 7; no PDF export was requested. The
standalone animated HTML should mirror the editable deck. TJ has locked the four current slide files and the final script. No further
content or layout edits are authorized. Speaking rehearsal is reported complete;
live output/citation review, six-case scoring, signed-in Platform preflight and
fitting interaction waits into the recorded take remain separate checks.

Sync verification: 32 offline Python tests and three Markdown checks passed.
The controlled-browser replay test passed five-second alert arrivals, pause/
resume/replay, all three handoffs, aligned fixture timestamps, failure/retry and
responsive widths, with zero model requests or page errors. All four locked
slides were visually inspected at their saved density: 83 / 86 / 86 / 67 visible
words, no clipping or overlap observed. Slide 3 retains its locked “incident
resolution” / estimated MTTR wording, while the final script proposes time to a
correct next step. This mismatch is recorded without editing the slide; no
measured MTTR improvement or external comparison evidence is supplied here.

### Faster demo alerts, October 7

The operations overview now delivers the remaining alerts five seconds apart:
streaming is preloaded, compute arrives after five active seconds and RDS after
ten. The replay clock and metric trends still align with the existing 20:12 UTC
compute and 20:16 UTC database snapshots. Pause, hidden-tab suspension and Replay
retain their behavior. This supersedes the earlier 15/45-second arrival schedule.

### Animated HTML slides, October 7

At TJ's request, `fslides/decks/brightward/` now contains an animated four-slide
version of the approved flow, inspired by the supplemental diagrams in the linked
Elastic presentation. It uses Brightward's navy/teal identity, isometric SVG
assembly, moving retrieval connectors, an explicitly unvalidated pilot-target
comparison and a proposed rollout graphic. `notes.json` contains TJ’s revision 8 talk
track and the full app-then-Platform demo between slides 2 and 3. A standalone HTML copy lives
beside the manifest. TJ requested no PDF exports during this editing phase.
The original PDF remains intact; the content JSON and narration now reflect TJ’s revised script.
This is a presentation-format addition, not a change to the app, knowledge corpus
or validation/recording gates. Start the local deck with the launcher documented
in `fslides/README.md`; restart an already-running starter server once to load
the four-slide manifest.

### Approved presentation flow, October 7

Use exactly four slides: (1) the situation and manual root-cause analysis, (2) The OpenAI Platform & API, including Vector Store and Agent roles in faster or automatic remediation, (3) value and guardrails, and (4) next steps and recap. The entire demo, including the OpenAI Platform Agents website and clicking through the local UI, takes place between slides 2 and 3. There is no separate demo slide and no return to the slides during the demo.

Retain the five-minute recording limit. Revision 8 allocates 0:00-0:48 to slide 1, 0:48-1:35 to slide 2, 1:35-3:08 to the app, 3:08-3:43 to Platform Agents, 3:43-4:22 to slide 3 and 4:22-4:51 to slide 4. TJ has timed the speaking script with a stopwatch. Automatic remediation remains a future integration requiring scoped tools and application-enforced controls. The present app uses Responses and File Search for recommendations and makes no infrastructure changes.

### Current configuration: default triage, no saved agent

At TJ's request on October 6, the saved Platform SRE agent integration was removed and the original Responses API/File Search flow restored. Triage and passage explanations use `gpt-5.4-mini` by default (`OPENAI_MODEL` can override it). Briefs use native File Search citations, require exact retrieved excerpts and use `store=False`. There is no agent selection or `BRIGHTWARD_BACKEND` selector, including if an old shell still exports `agents`.

The current Brightward API project, private key and ten-document ingestion manifest are retained. Ingestion no longer checks saved-agent access. No reindex is required: the approved knowledge corpus is unchanged. The credential helper still uses a hidden prompt and stores the key privately at `.northstar/openai-api-key`; the project ID is still explicit on API requests. Old remote resources and private historical agent runs remain available for deliberate cleanup.

The extra RDS configuration, session/transaction, memory and impact observations, fictional change-review approval, server injection and answer note were removed. Both copies of the supplemental fixture were deleted. Database triage again uses the original incident, candidate PRs and retrieved runbooks; unknowns stay unknown. The database alert, initial metrics, original PR fixtures and ten knowledge documents remain part of the demo.

Validation: 32 offline Python tests and three Markdown-renderer checks passed. The restarted server at `http://127.0.0.1:8000/` reports `backend=responses` and `agent_id=null`. A fresh live RDS brief completed with native citations to NS-RB-006/007; it listed effective settings, session attribution, transaction age, blockers and deployment state as missing, and kept review/approval conditional. The source viewer opened the returned runbook excerpt. Earlier saved-agent results remain historical. Next: run the six-case evaluation, review current recording output and check the integrated take against TJ’s completed speaking rehearsal.

**Current script: revision 8, 815 spoken words.** TJ’s segment labels total 291 seconds and his reported speaking rehearsal fits under five minutes. The browser demo runs 1:35-3:43, with app/citation inspection before the Platform configuration example. The builder validates this continuous timeline against the five-minute limit and can update narration and speaker notes with `--narration-only`. The original four-page PDF remains unchanged from draft 7. Current-output review, six-case scoring and signed-in Platform preflight are still separate from the completed speaking rehearsal. Older five-slide and draft-7 timing descriptions are historical.

### Completed and verified

- **Supplemental RDS evidence removed.** The automatic observations and fictional change review were reverted at TJ's request. The original incident's missing evidence remains missing, with no collection panel or approval note. This supersedes the earlier automatic-evidence implementation and its live-agent validation.

- **RDS database demo added.** The app now has three scenarios and ten operational documents. RDS connection pressure arrives after 45 active replay seconds (20:16 UTC), with connection count and pool wait charts, matching logs and Investigate prefill. Candidate GitHub PRs 318/311 cover a larger pool and longer worker transactions; staging-only PR 316 is excluded. New NS-RB-006, NS-RB-007 and NS-INC-005 support diagnosis, change review and historical similarity; NS-OWN-001 now includes Database Operations. Stage-2 and app data match. Reindex with `python -m northstar.ingest --new-store`, restart and refresh; this session had no API key and did not change remote resources. Twenty-four Python tests, three Markdown tests and four browser suites passed with mocked model output; desktop/mobile layouts checked. Live RDS generation and the revised six-case evaluation remain pending. The current slide/narration draft still selects two incidents and needs corpus-count wording reconciled before recording.

- **Citation inspection now explains semantic relevance.** Clicking a numbered citation shows the statement, a model explanation of why a retrieved passage is relevant, and a subtle highlight on a verbatim quote. The full source highlights the same quote. This is an assessment of returned evidence, not the search engine's internal rationale or a similarity score; quote validation checks provenance, not semantic correctness. One extra Responses call on first inspection is reused per source/statement in the current brief. A bounded server memory cache retains the original excerpts for up to one hour of lookup eligibility. Unsupported evidence and errors remain explicit. Restart, refresh and generate a new brief; no reindex is required. Twenty-two Python tests, three Markdown tests and all four browser suites passed with mocked relevance/model output; desktop/mobile source views were visually checked. Live explanation quality remains unverified.

- **Simulated GitHub evidence appears only in generated triage output.** Possible reasons now carry a GitHub PRs source badge, and the prompt requests GitHub PR #number (repository) attribution without repeating simulated/synthetic in each reason. The global synthetic-demo label and internal fixture provenance remain. Restart the server and regenerate to apply this prompt wording. At TJ's request, the upfront Possible reasons to investigate panel, cards, diffs and selection controls were removed. Loading an incident automatically attaches its two candidate PR IDs to the next request; lower-relevance fixtures remain excluded. The server validates scenario membership and supplies the corresponding simulated evidence for the model's Possible reasons section. Native File Search citations remain separate. The live streaming brief was observed naming PRs 142 and 139 as hypotheses requiring deployment/runtime verification. The knowledge corpus and backend contract are unchanged by the panel removal; refresh the browser, with no restart or reindex needed for this UI change.

- **Synthetic monitoring overview added at TJ's request.** The default landing page now has four metric trends, an eight-event log stream and an alert inbox. Streaming is preloaded; compute arrives after 15 active seconds. Pause/Replay controls and an 8× October 6 replay clock keep the two existing incident timestamps coherent. Investigate opens the existing page with incident type, notes and question populated; generation remains explicit. Navigation preserves a draft, and loading another alert clears prior sources/results. No corpus, ingestion or model behavior changed. Both browser suites passed, including controlled timing, pause/replay, both alert handoffs, failure/retry, responsive widths and the prior citation/source flow; 11 backend and 3 Markdown tests passed. Desktop/mobile screenshots were visually reviewed. Direct `/#triage` access retains the prior rehearsal flow; revise recording cues only after live validation.

- Draft 5 leads with the OpenAI vector store and retains the two-incident customer workflow and explicitly unvalidated 30% target. App control labels and automatic scenario loading were checked against the current UI code. `presentation/content.json` now holds timed rehearsal beats; the builder regenerates narration and the five-page PDF together. No slide wording or design changed. Actual store evidence and output alignment remain pending.
- The local Codex project is **Brightward Streaming**, with primary folder `/home/tj/Documents/Brightward Streaming` and app folder `Brightward-Demo/`. The app project listing now confirms the correct name and path. **No local project rename or Edit project step remains.**
- The virtual environment was rebuilt at the new path with the same 27 pinned dependencies. Fish activation, application import, real localhost startup/read routes, 11 backend tests and 3 Markdown-renderer tests passed. The obsolete app compatibility link and rollback environment were removed in the approved local cleanup. No corpus or ingestion content changed during the folder move.
- Human-facing app copy, the five-page PDF, narration, brief, board, both corpus copies, fixtures and evaluation prompts use Brightward. Portable ZIPs were removed during cleanup and will be rebuilt for submission. All five PDF pages were visually reviewed. The Python `northstar` module, `.northstar` state directory, NS document IDs and ns instance IDs remain stable.
- The source viewer renders rich Markdown; the incident dropdown starts at “Select Incident...”; the headline is “Your operational knowledge. Clear next steps.” Both sample loaders and switching back to streaming were verified. Prior real compute retrieval/source-view checks used the earlier corpus and do not validate the renamed sources.

### Next work, in order

1. **Use TJ’s revision 8 script and animated deck.** Keep the app-then-Platform demo between slides 2 and 3. Preserve the original PDF; export a new one only if TJ requests it.
2. **Validate recording output and Platform views.** Verify the ten-document store, inspect a fresh streaming brief and its cited passage/relevance explanation, and confirm signed-in Agents controls. Compute and RDS remain available for evaluation. Preserve manifests and remote resources; no reindex is required for script or slide edits.
3. **Run the six-case evaluation.** Six cases and 24 criteria are authored but not scored. Record actual answers, excerpts, model/corpus version, latency and usage/cost or explicitly unavailable status. Require all safety criteria to pass.
4. **Check the integrated take.** TJ has completed the speaking rehearsal under five minutes. Fit the actual API wait, citation reading and navigation into the 48 / 47 / 128 / 39 / 29-second schedule. Label any previously captured real validated run.
5. **Record and package.** Check the final five-minute recording, align reviewer materials with validated evidence and confirm submission formats/deadline. PDF regeneration remains deferred unless requested.

### Source of truth and scope

The script source is `presentation/content.json`. Run
`python tools/build-slides-pdf.py --narration-only` to regenerate the annotated
narration, plain-text speaking script and fslides speaker notes while preserving
`Brightward-Slides.pdf`. Do not edit generated narration alone. The PDF mode
remains available for an explicitly requested export and uses ReportLab/local
fonts. Retain the approved Aurora/Modern clarity design.

The current animated deck is `fslides/decks/brightward/`; refresh its standalone
HTML with the pinned launcher after slide or note changes. All four slides and
the entire browser demo retain their approved order. Publishing or a comment
gateway is not enabled by deck editing or by pushing this repository. No app
features, extra slides or production actions belong in script synchronization.

### Runtime handoff

TJ uses **fish**. Stop an existing demo server with Ctrl+C; if a virtual environment is already active, run `deactivate` before reactivating at the new path. In the terminal where TJ's API key is configured:

```fish
cd "/home/tj/Documents/Brightward Streaming/Brightward-Demo"
source .venv/bin/activate.fish
python -m northstar.credentials
python -m northstar.ingest --new-project --new-store
python -m northstar.server
```

Open `http://127.0.0.1:8000/`. The upgrade archives the old manifest and resumes/reuses a matching new revision; it does not delete old remote resources. Do not bypass corpus hash checks. The current configuration checkpoint above records the later verified default backend and live RDS run; earlier no-key/reindex notes are historical. A new chat should check current readiness without exposing credentials. The server does not automatically load `.env`.

This is the authoritative local handoff. TJ approved a local-only working workflow and removal of the separate Northstar Streaming cloud project and Library copies. The Northstar Streaming cloud project and its chats/tasks were permanently deleted after explicit confirmation that the local files remain intact. The 17 selected Northstar Library file entries were removed from the active list. Six loose files are confirmed in Trash with 30-day recovery. The original Northstar-Streaming-Incident-Triage cloud folder and its subfolders were also permanently deleted after separate confirmation; absence was verified in the active Library. Trash has not been emptied. The API vector store and active/archived ingestion manifests are separate and must be preserved. Historical local originals, migration records and rollback backups were removed in the approved cleanup.

## Assignment and finish line

Produce a five-minute recorded demo with four slides under TJ's October 7 flow, showing specific customer context, current pain, improved workflow, product use, expected value, practical assumptions, data constraints, governance and next steps. Use only synthetic, anonymized or public data. AI assistance is permitted; TJ must be able to explain the choices. The original assignment suggested approximately five hours of effort and five business days from recruiter receipt. Receipt date, exact deadline and required submission formats remain unconfirmed; do not infer the deadline from this brief’s date.

Finish means: actual retrieval for the scripted streaming case is reviewed, six evaluation cases are scored with evidence, the five-minute recording is rehearsed and checked, and the final package matches the recruiter instructions. Building files is not the same as finishing validation or recording.

## Customer, workflow and value

Fictional customer in TJ’s current script: Brightward Media, a video streaming platform with self-built monitoring tooling. The app and repository retain Brightward Streaming as their existing name. Business unit/persona: Reliability Operations, on-call site reliability engineer. Pain: manually searching operational runbooks and prior incidents, reconciling applicability/authority, and finding the owner during disruption. Service disruption risks viewer experience, advertising delivery and subscriber trust; no exact financial loss is claimed.

Improved workflow: engineer supplies a sanitized incident snapshot and question → File Search retrieves passages from the OpenAI vector store → the Responses API/model drafts a short cited brief → engineer inspects returned evidence and selects the next check. The model has no live monitoring or infrastructure action tools. Use the store as the shared knowledge layer, not as an autonomous diagnostic or remediation engine.

Unvalidated pilot target: 30% less time to a **correct next step**, measured against manual triage on comparable representative incidents. Track time, correctness, citation support, inappropriate recommendations, latency and cost. Potential benefits are less search effort, shorter disruption and improved viewer experience. No realized savings or revenue gains have been measured. Pilot within one bounded SRE team and the two selected incident types, with approved documents and human review.

## Three incident examples

### Frozen live stream

Fixture: `Stage-2/fixtures/incident-input.txt`. Playlists return HTTP 200 while playback freezes and some segments return 404 after a CloudFront configuration submission. The packager health check passes. Freshness, rollout and scope remain unknown. Expected behavior: compare repeated authorized origin/CDN samples; distinguish edge freshness from origin publishing; inspect current change guidance and relevant history. Remediation remains conditional on evidence, exact scope, compatible configuration, owner review, approval and recovery checks. Historical broad invalidation does not override the current runbook.

### Unhealthy EC2 application

Fixture: `Stage-2/fixtures/compute-input.txt`. The playback-session application is unhealthy after deployment, while EC2 status checks pass. An engineer-supplied OS snapshot reports root filesystem use increasing to 96%. Largest growing files, inode use, write errors, logging level and rotation state are unknown. These are manual observations, not metrics collected by the assistant.

Expected behavior: retrieve NS-INC-004 as a possible precedent, use NS-RB-004 to prioritize disk-consumer, logging/rotation and application-error evidence, and explain what would confirm or contradict the hypothesis. Do not equate application health with EC2 status checks or propose blanket log deletion. Any configuration, cleanup, restart or capacity action needs reviewed scope, preservation/retention, approval, rollback and recovery checks. If current evidence shows healthy rotation and artifact growth, revise the hypothesis.

### RDS connection pressure

Fixture: `Stage-2/fixtures/database-input.txt`. Catalog requests wait for database connections as DatabaseConnections reaches 492 while CPU is 34%. Replica count rose from 12 to 24; effective pool configuration, session ownership and transaction state remain unknown. Retrieve NS-RB-006/007 and historical NS-INC-005; distinguish aggregate pool demand from long transactions or other clients. PRs 318 and 311 are candidate contributors, not deployment proof. Require Database Operations/application-owner review, Incident Lead approval and observed recovery.

The author-only file holds concealed scenario intent. Never upload it or pass it as incident context. Initial fixtures are deliberately insufficient for a confirmed diagnosis.

## Corpus and data boundary

Canonical package: `Stage-2/`. Application snapshot: `Brightward-Demo/data/`; keep them byte-identical. Exactly ten files enter retrieval via `northstar/corpus.py`, never a broad directory glob.

| File | ID | Role |
| --- | --- | --- |
| 01-playlist-freshness.md | NS-RB-001 | Streaming freshness checks and competing explanations |
| 02-compute-disk-pressure.md | NS-RB-004 | Compute disk/application triage and conditional recovery |
| 03-cdn-change-safety.md | NS-RB-003 | Current CDN change prerequisites |
| 04-incident-playlist-cache.md | NS-INC-001 | Historical streaming case, including superseded action |
| 05-incident-log-rotation.md | NS-INC-004 | Historical compute case; similarity is only a lead |
| 06-evidence-and-precedent.md | NS-RB-005 | Evidence authority, applicability and impact limits |
| 07-ownership-escalation.md | NS-OWN-001 | Streaming/compute/database owners and approval responsibilities |
| 08-rds-connection-pressure.md | NS-RB-006 | Connection pressure diagnosis and competing explanations |
| 09-rds-change-safety.md | NS-RB-007 | Database/application change review and recovery |
| 10-incident-rds-pool-fanout.md | NS-INC-005 | Historical connection-pool and replica growth case |

Three incident fixtures, GitHub change fixtures, the evaluation JSON and the author-only answer key are outside retrieval. Brief, board, slides and rubrics are not knowledge-store input. Incident text and question are transmitted to OpenAI only when the engineer generates a brief. Credentials remain in the server environment; the application does not load `.env` automatically. Do not paste keys in chat or browser code.

## Implementation and governance

Local FastAPI app binds to 127.0.0.1:8000. No remote MCP service is implemented; `/mcp` and OAuth discovery probes return 404. The regular browser app uses `/api/*`. A missing favicon is unrelated to triage functionality.

Responses API requires File Search against the single manifested vector store and requests `file_search_call.results`. Native file citations are mapped to allowlisted IDs and returned excerpts. Reject missing/incomplete search, unknown file IDs, missing citations or uninspectable excerpts. Local hashes and remote file membership must match. These checks enforce a boundary; they do not prove semantic citation support.

The provisional model remains `gpt-5.4-mini`, overridable through `OPENAI_MODEL`; it has not been selected by a completed quality/cost evaluation. The store expires after seven days of inactivity. That does not promise deletion of uploaded file objects. Keep active and archived manifests until intentional cleanup is confirmed. `store=False` is a response-storage setting, not a blanket zero-retention claim.

Production controls still required: authenticated and scoped knowledge access enforced outside the model, approved/current document lifecycle, sensitive-data review, retention/deletion decisions, logging and human review. The local demo does not implement production authentication, authorization, telemetry, remediation or a measured SLA. Prompt injection in documents or incident text cannot authorize actions.

Approved future mention: scoped action tools through API, CLI or MCP could support human-approved remediation, followed by bounded automatic remediation for tested, low-risk cases. The application must enforce permissions, approval policy, rollback and recovery checks. No action integration is selected or implemented and no fix/recovery is claimed by this prototype.

## Four-slide presentation and uninterrupted demo

| Segment | Story | Window |
| --- | --- | --- |
| Slide 1 | TJ introduction, fictional customer and manual investigation | 0:00-0:48 |
| Slide 2 | Platform/API, retrieval, agents and future remediation | 0:48-1:35 |
| Demo 1, no slide | Monitoring introduction, streaming brief and citation inspection | 1:35-3:08 |
| Demo 2, no slide | Illustrative Platform Agents configuration and external tools | 3:08-3:43 |
| Slide 3 | Unvalidated target, measurement and guardrails | 3:43-4:22 |
| Slide 4 | Recap, proposed pilot and closing | 4:22-4:51 |

There is no extra cover, demo slide or appendix. All browser interaction stays
between slides 2 and 3, app first and Platform second. The 128-second demo has a
93-second app allocation and a 35-second Platform allocation. The local app
invokes Responses and File Search directly; the Platform Agent is illustrative.

Revision 8 has 815 spoken words. TJ reported a stopwatch rehearsal just under
five minutes; supplied segment labels sum to 4:51. The builder checks that all
segment and beat windows join into the 291-second schedule under a 300-second
limit. `Brightward-Speaking-Script.txt` provides the speaking paragraphs alone;
`Brightward-Slide-Copy-and-Narration.md` also includes actions and preparation.

Start with the synthetic Operations Dashboard and click Investigate on the
streaming alert. Generate a real brief, inspect returned guidance and its
citation, then switch directly to the signed-in Platform Agents example. Return
to slide 3 after that example. Generation/citation quality, live navigation and
API waits remain to check in the integrated recording. Keep the synthetic label
visible and label any previous capture of a real validated run.

## Core-requirement coverage

| Requirement | Where it appears |
| --- | --- |
| Industry, business unit/persona, workflow and problem | Slide 1 and narration: Brightward Media video streaming, Reliability Operations and on-call SRE |
| Current pain and improved workflow | Slides 1-2 and demo: manual investigation, retrieved guidance and engineer review |
| Selected product surfaces in use | Slide 2 and the demo between slides 2 and 3: vector store, File Search, Responses and separate Platform Agents configuration |
| Expected impact | Slides 1 and 3: disruption stakes, unvalidated target and measurement |
| Assumptions, data and governance | Demo and slide 3: synthetic/manual inputs, current documents, access, review and requirements before automated actions |
| Next steps and recap | Slide 4: recap, proposed SRE pilot and pilot decision; evaluation remains part of preparation |

## Approved design

Aurora palette and Modern clarity remain approved. Background #0B1220, surface #162235, text #EEF4FA, accent #5EEAD4, muted #A9B9CF, divider #314158; warning #FBBF24, success #86EFAC, error #FDA4AF. Sora headings, Inter body, IBM Plex Mono technical labels. Rounded cards, generous whitespace, readable source inspection. Fonts are local and embedded in the PDF. App standards remain in `Brightward-Demo/DESIGN.md`. No HTML-generated slides going forward unless TJ changes this instruction.

## Validation and status

October 7 presentation edit: four rendered PDF pages visually reviewed, layout-width and 300-second timing checks passed, and narration regenerated from the same source. No application code, corpus, credentials or remote resources changed. No new live model run or evaluation is claimed for this script edit.

Eleven offline Python tests and three Markdown-renderer tests passed after the rename on October 6, including strict citation/manifest handling, data exposure boundaries, two sample routes, and interrupted corpus migration/retry preserving prior IDs. One upstream Starlette/httpx deprecation warning remains. Browser sample loading, scenario-specific question replacement, switching back and disabled generation without setup were checked on a temporary loopback server. Five rendered PDF pages were visually reviewed. These checks do not validate actual generated answers.

Six model-evaluation cases, each with four criteria (24 total), are written but **not run**: initial streaming, compute precedent, compute contradictory evidence, current authority/streaming competing cause, unsupported impact with injected instruction, and RDS connection pressure. Send only each case’s incident and question. Record actual response, returned excerpts, model/corpus version, latency, token/tool usage and cost or explicitly unavailable status. Score criteria with human evidence; all safety criteria must pass before recording.

## Board tasks and remaining work

1. Four-slide deck: current animated slides locked by TJ and visually inspected. Original four-page PDF preserved; no new PDF export.
2. Spoken script: TJ-authored revision 8, 815 words, stopwatch rehearsal reported under five minutes. Segment labels sum to 4:51; narration and all four notes match.
3. Product explanation: current Responses/File Search guidance, illustrative Platform Agents and future remediation remain separate in implementation documentation.
4. Design standards: approved Aurora/Modern clarity retained. No further content or layout edits to the locked slides.
5. Timed recording incident: streaming, followed by the Platform configuration example. Compute and RDS remain available in the app and evaluation.
6. Synthetic knowledge/input: ten allowlisted documents and three fixtures, with six evaluation cases. No corpus changes or reindex.
7. Retrieval/backend: default Responses/File Search retained. Current configuration checkpoint records prior live RDS validation; recording-case review remains separate.
8. Monitoring and triage UI: five-second alert arrivals retained. The controlled-browser replay test passes timing, pause/replay, three handoffs, fixture alignment and responsive checks.
9. Six-case evaluation: 24 criteria authored; formal model runs and scoring pending.
10. Reviewer README: current setup, animated-deck/script sequence and limits synchronized; measured model-evaluation results pending.
11. Rehearsal/recording: speaking rehearsal complete; signed-in Platform preflight, API waits, citation review and integrated recording remain to check. Preserve the locked slide 3 wording mismatch as a validation finding.
12. Submission package: regenerate source ZIPs after validation; final recording/results and recruiter formats/deadline pending.

## Files and continuity

Active: this brief, `Brightward-Project-Board.html`, the original PDF, annotated narration, `Brightward-Speaking-Script.txt`, `presentation/`, the PDF/narration builder, `fslides/`, `Stage-2/`, and `Brightward-Demo/`. The root README is a short launch guide; the brief remains the single detailed project record. Portable ZIPs will be regenerated at submission time. Exclude credentials, `.northstar` manifests, virtual environments and test caches from shared packages.

Approved cleanup removed `archive/`, `sync/`, `tmp/`, pytest caches, the old virtual environment, both root ZIPs, the Northstar brief pointer, the app compatibility symlink and empty `OBSoutput/`. At that historical cleanup checkpoint the workspace had no Git history or retained local rollback archive. It now has a Git repository and the configured `TJFeneran/brightward-streaming` GitHub remote. Active app code, corpus copies, presentation sources, deck, script, active environment and `.northstar/` manifests were preserved. Do not recreate cloud copies or synchronization records. The cleanup was limited to this project folder and the named cloud copies. Post-cleanup checks confirmed 45 protected active files byte-identical, all 11 backend tests and 3 Markdown-renderer tests passing, and about 56 MB removed.

After each material decision, update this brief first and the board second. Preserve approved scope and unfinished work across chats. Do not turn exploratory ideas into approved changes or mark successful HTTP transport as validated model behavior.

## Product references

Official [File Search](https://developers.openai.com/api/docs/guides/tools-file-search), [Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration) and [SRE incident-response example](https://developers.openai.com/cookbook/examples/agents_api/apps/sev_bot/readme) checked October 7, 2026. The SRE reference records rollback approval without executing a deployment. AWS examples and all Brightward operational policies/data are fictional; the local assistant remains advisory.
