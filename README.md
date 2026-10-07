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

Open **http://127.0.0.1:8000/** for the simulated monitoring overview. Click **Investigate** on an alert to open the existing page with its incident, notes and question filled in; click **Generate triage brief**, then inspect a returned source excerpt. The streaming alert is preloaded and the compute alert arrives after five active seconds and RDS after ten. Pause or replay the simulation as needed. Use **Investigation**, or `/#triage`, to select either incident directly.

`credentials` uses a hidden prompt and saves the key with owner-only access in the ignored `.northstar/openai-api-key` file. Run it once or when rotating the key. The saved key takes precedence over `OPENAI_API_KEY`; `.env` is not loaded. Ingestion verifies the knowledge store in the selected project, reuses a matching project/corpus revision, and preserves old manifests and remote resources. Keep `.northstar/` private and exclude it from submission packages. Historical agent-session records remain private; new triage requests use Responses with `store=False`.

The default model is `gpt-5.4-mini` for triage and source explanations, overridable with `OPENAI_MODEL`. The saved SRE agent integration and supplemental RDS observations/fictional approval have been removed. The database scenario, candidate PRs and ten-document index remain available. No reindex is needed for this rollback. Start or restart the server and refresh before generating a new brief. Read the project brief for current validation status.

## Presentation and script

The current [speaking script](Brightward-Speaking-Script.txt) is TJ’s revision 8.
TJ reported a stopwatch rehearsal under five minutes; segment labels total
4:51. The final script and current four slide files are locked; preserve their
content and layout. Present the [animated deck](fslides/README.md) with the app walkthrough,
then the Platform Agents walkthrough, between slides 2 and 3. The original
four-page PDF is preserved from draft 7; PDF exports remain deferred.

The shared script source is `presentation/content.json`. Update the annotated
narration, plain-text script and speaker notes without replacing the PDF:

```sh
python3 tools/build-slides-pdf.py --narration-only
```

After editing slides or notes, refresh the portable HTML copy using the pinned
launcher:

```sh
npm run slides -- --deck fslides/decks/brightward export brightward-streaming.html
```

The 30% figure remains an unvalidated pilot target. Live output review,
six-case scoring and Platform preflight remain separate from speaking rehearsal.
Pushing source to GitHub does not enable website publishing.
