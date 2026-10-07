# Brightward Streaming

Local five-minute demo of an OpenAI vector store supporting an on-call SRE through three synthetic incidents. Read [the project brief](Brightward-Project-Brief.md) for the authoritative status, decisions and next steps. The [board](Brightward-Project-Board.html) summarizes it.

Private source repository: [TJFeneran/brightward-streaming](https://github.com/TJFeneran/brightward-streaming).

## Launch

Use fish. Stop an existing demo server with Ctrl+C; run `deactivate` first if an older virtual environment is active. The demo uses Brightward's configured API project and the default Responses/File Search flow, with no saved agent.

```fish
cd "/home/tj/Documents/Brightward Streaming/Brightward-Demo"
source .venv/bin/activate.fish
python -m northstar.credentials
python -m northstar.ingest --new-project --new-store
python -m northstar.server
```

Open **http://127.0.0.1:8000/** for the simulated monitoring overview. Click **Investigate** on an alert to open the existing page with its incident, notes and question filled in; click **Generate triage brief**, then inspect a returned source excerpt. The streaming alert is preloaded and the compute alert arrives after 15 active seconds. Pause or replay the simulation as needed. Use **Investigation**, or `/#triage`, to select either incident directly.

`credentials` uses a hidden prompt and saves the key with owner-only access in the ignored `.northstar/openai-api-key` file. Run it once or when rotating the key. The saved key takes precedence over `OPENAI_API_KEY`; `.env` is not loaded. Ingestion verifies the knowledge store in the selected project, reuses a matching project/corpus revision, and preserves old manifests and remote resources. Keep `.northstar/` private and exclude it from submission packages. Historical agent-session records remain private; new triage requests use Responses with `store=False`.

The default model is `gpt-5.4-mini` for triage and source explanations, overridable with `OPENAI_MODEL`. The saved SRE agent integration and supplemental RDS observations/fictional approval have been removed. The database scenario, candidate PRs and ten-document index remain available. No reindex is needed for this rollback. Start or restart the server and refresh before generating a new brief. Read the project brief for current validation status.

## Working files

The project also has an [animated four-slide fslides deck](fslides/README.md) in
`fslides/decks/brightward/`, using the adapted Brightward style. Its speaker notes
retain the approved flow and the full demo between slides 2 and 3. Run
`npm run slides -- --deck fslides/decks/brightward serve` from this root to present
it. The existing PDF and its source remain available. Run `npm run slides:doctor`
to check the tooling, or `npm run slides -- --help` for commands.

- [Slides](Brightward-Slides.pdf) and [rehearsal script](Brightward-Slide-Copy-and-Narration.md): four slides; draft 7 has 434 spoken words. Situation, Platform/API, value/guardrails, then next steps/recap. The entire Platform Agents and app demo runs between slides 2 and 3 (1:10-4:00). Recording lock awaits validation, evaluation and timed rehearsal.
- `presentation/` and `tools/build-slides-pdf.py`: editable content, fonts and PDF builder.
- `Stage-2/`: canonical knowledge, incident fixtures, evaluation cases and author-only key.
- `Brightward-Demo/`: app, active environment and matching data snapshot. See its [README](Brightward-Demo/README.md) for installation and technical details.

Run checks from `Brightward-Demo/`:

```sh
.venv/bin/python -m pytest -q -p no:cacheprovider
node tests/source-markdown.test.cjs
```

Regenerate the PDF and narration together from the workspace root:

```sh
/home/tj/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 tools/build-slides-pdf.py
```

Old backups, migration records, cloud-original downloads, compatibility pointers and portable ZIPs were removed during cleanup. Rebuild submission packages after validation; exclude credentials, `.northstar/`, virtual environments and caches.
