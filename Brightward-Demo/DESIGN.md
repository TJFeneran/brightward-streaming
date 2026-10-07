# Brightward design standard

Approved direction: **Aurora + Modern clarity**. This implementation keeps the incident and its evidence prominent and reserves warning color for unresolved decisions. The approved monitoring extension adds a clearly labeled synthetic overview with metric trends, bounded logs and infrequent alerts. Each alert hands off to the existing evidence-focused investigation page.

| Role | Token |
| --- | --- |
| Background / surface | `#0B1220` / `#162235` |
| Primary text / secondary text | `#EEF4FA` / `#A9B9CF` |
| Accent / divider | `#5EEAD4` / `#314158` |
| Ready / warning / error | `#86EFAC` / `#FBBF24` / `#FDA4AF` |
| Heading font | Sora 500 |
| Body and controls | Inter 400, 500, 600 |
| Metadata | IBM Plex Mono 400 |

Use near-white text for content, teal for actions and linked evidence, amber for an unresolved resolution path. Always pair status color with words. Primary buttons use navy text on teal. Do not use a green “resolved” state without actual recovery evidence.

Desktop app hierarchy: 30px page title, 16px panel titles, 12–14px main content, 10–11px labels and metadata. The generated brief uses a compact 12px/1.75 reading scale; increase browser zoom for recording if needed. Record at a readable app scale and inspect the exported video, not just the raw desktop. Small metadata is supplementary, never the only carrier of an essential point.

Cards have 12px corners, controls 8px, citation chips 4px, and statuses pill corners. Use a 4px spacing base, 24px panel padding/gaps, 48px desktop outer margins, and thin dividers. Wide screens use a context column and a larger output column; below 700px they stack. A source opens in one modal with exact retrieved excerpts and an optional full-document disclosure. Keyboard focus is visible; native dialog semantics support Escape and focus containment.

Component states: empty → working with elapsed time → ready for review, or actionable error. Disable repeat generation while a request is running. Setup unavailable is a visible state, with generation disabled. There is no fabricated preview brief or silent fallback. Source metadata remains tied to the returned citation IDs.

Shared slide/diagram rules: reuse these colors and fonts; one primary message per slide; 16:9 canvas; 40–48px slide titles and 24–28px essential body text at 1920×1080; avoid essential text below 22px. Use rounded rectangles and thin directional connectors, at most five nodes across. Keep input, retrieval, output, and human decision visually distinct with labels. Put future action integration in a labeled future note, outside the current execution path. The deck and diagrams are not yet built or visually verified.

App screen inspection and keyboard/mobile checks are recorded in `CHECKPOINT.md`. Final recording readability, slide layout, and cross-deliverable consistency remain Stage 5/6 gates.

## Synthetic overview

The overview is the default landing view; `/#triage` opens the existing investigation directly. Six SVG metric trends refresh every five seconds, and the log stream retains eight events. The October 6 replay uses an 8× clock to align the existing incident timestamps: streaming is preloaded at 19:42 UTC, the replay starts at 20:10 UTC, and compute arrives after 15 active seconds at 20:12 UTC. The disk trend reaches the fixture's 96% at that moment. RDS connection pressure arrives after 45 active seconds at 20:16 UTC, with 492 connections and pool wait p95 of 2600 ms. Alerts remain open and stop at three; replay resets the local simulation. Pausing or hiding the browser tab suspends the clock.

Use severity words with color, no decorative chart animation, descriptive chart labels and one polite announcement for an arriving alert. Desktop alerts use a table; mobile alerts stack with visible investigation actions. Navigation preserves the current draft. Investigate reloads the selected canonical fixture and question, clears stale sources/results, and never generates automatically. Telemetry is generated locally; the retrieval corpus and API data boundary are unchanged.

## Simulated GitHub evidence

GitHub-related possible reasons appear only in the generated brief. There is no upfront PR panel, diff viewer or checkbox selection. Loading an incident automatically includes its two candidate changes; lower-relevance records are excluded. The server still validates scenario membership. Loading/switching/failure clears old change context. Generated reasons use explicit GitHub PR/repository attribution and a GitHub PRs source badge. The global demo badge discloses simulation; the reasons distinguish possible causes from confirmed deployment or effective configuration; File Search citation checks remain unchanged.


Citation inspection now includes the selected statement (or original question), a short model explanation under “Why this passage is relevant,” and a subtle teal highlight on the verified quote. Full-document inspection highlights the same passage and scrolls to it. Selection is semantic model assessment of the returned excerpts; there is no keyword-overlap relevance score. Explanations are cached within the current brief. Loading, unsupported evidence, expired context and upstream errors are explicit while excerpts remain available. Stale asynchronous responses cannot change the current inspection. Exact quote checks enforce provenance, not semantic correctness.


The RDS case adds two charts (database connections and catalog acquisition wait), replica/connection logs, an investigation handoff and two candidate GitHub changes. Desktop uses three metric columns, narrower layouts use two. The corpus expands to ten documents with diagnosis, change/recovery and historical database guidance; source inspection and semantic explanations share the same flow. Reindexing is required for this revision.
