# Brightward: OpenAI Platform & API - slide copy and narration

Revision 7, October 7, 2026. PDF-only presentation, generated directly by `tools/build-slides-pdf.py` from `presentation/content.json`. Four slides, five minutes. Four-slide rehearsal draft. Recording lock awaits current-output validation, the six-case evaluation, a verified Platform walkthrough and measured timing.

Brightward's manual root-cause investigation establishes the need. Slide 2 explains the OpenAI Platform and API, including vector stores, agents and the path toward controlled remediation. The entire Platform and app demo sits between slides 2 and 3. Value and guardrails follow, then next steps and recap. The local app uses Responses API with File Search and provides recommendations; automatic remediation is a future integration path.

## Timing

| Segment | Window | Seconds | Spoken words | Speech at 130 wpm |
| --- | --- | --- | --- | --- |
| Slide 1: Manual root-cause analysis | 0:00-0:30 | 30 | 55 | 25 seconds |
| Slide 2: The OpenAI Platform & API | 0:30-1:10 | 40 | 70 | 32 seconds |
| Demo between slides 2 and 3 | 1:10-4:00 | 170 | 189 | 87 seconds |
| Slide 3: Value and guardrails | 4:00-4:35 | 35 | 67 | 31 seconds |
| Slide 4: Next steps and recap | 4:35-5:00 | 25 | 53 | 24 seconds |

Narration: 434 words, approximately 200 seconds at 130 words/minute, leaving approximately 100 seconds for interactions and waits. These are estimates, not a completed rehearsal. The separate demo budget is 170 seconds: 40 seconds for the Platform and store, then 130 seconds for the app: 75 streaming, 35 compute, and 20 for transitions/generation.

## Before the take (not spoken)

1. Read only the Spoken narration blocks aloud. Actions and pauses are presenter cues. Exactly four PDF slides accompany one uninterrupted browser demo between slides 2 and 3. The timing targets total five minutes and have not been measured in rehearsal.

2. Before recording, verify the current ten-document store, review fresh streaming and compute answers and their returned excerpts, and score the six-case evaluation. Require all safety criteria to pass. Align narration with actual output before locking this draft. Existing live RDS evidence does not substitute for these two recording cases. This presentation edit requires no reindex or application change.

3. Prepare the four-page PDF, the app at http://127.0.0.1:8000/ (or the verified running port), the signed-in Platform Agents page and the actual remote-store evidence view. Show ten allowlisted files with completed indexing statuses matched to the current manifest. Neither a local manifest nor the app document-count label proves remote ingestion. Label any capture Previously captured: validated Brightward store.

4. Prepare the Platform's custom-agent option, template gallery and SRE template or saved SRE example. Check the real controls and account access before the take. The 1:20-1:42 segment illustrates customization; it does not claim the local app invokes that saved agent. If the expected template is unavailable, use a custom example and change the spoken transition to 'Here is a custom SRE example in the Platform. I can tailor its instructions, knowledge access, and tools.'

5. Use this prepared instruction in the SRE example: "Help Brightward's on-call SRE triage streaming and infrastructure incidents. Use approved runbooks, incident history, and ownership guidance. Cite supporting evidence, separate observations from hypotheses, identify missing evidence, and propose the next check. Keep infrastructure changes with the engineer." Show the instruction field and available tool configuration. A template does not automatically have access to Brightward's store or infrastructure. Approval rules and action permissions need application enforcement.

6. Prepare the app on the Operations overview with the streaming alert visible, empty triage output, and the simulation paused. Click Investigate during the demo to prefill the streaming incident, then Generate triage brief. For compute, use Demo incident; it loads the fixture and question automatically. Keep the supplied questions. The app has three scenarios available; this timed take continues to use streaming and compute.

7. Preflight the actual source titles, relevance explanation and highlighted passages. Streaming targets NS-RB-001, Live HLS playlist freshness, through a numbered citation. Compute targets NS-INC-004, Historical case: debug logs filled an EC2 root volume, with next checks supported by NS-RB-004. Citation numbers vary. Retrieved excerpts support the findings; the full source adds context.

8. The whole demo runs 1:10-4:00: Platform/store 40 seconds, app 130 seconds. Keep the 2:40-3:15 streaming source inspection. Measure both generation waits, citation-explanation latency, navigation and reading time. The two ten-second app transition/generation slots are provisional. Stay in the browser throughout; return directly to slide 3 after the compute review.

9. If generation fails, the expected source is absent, or the passage does not support the discussion, resolve it before another take. Never describe an expected answer as an observed result. If measured waits do not fit, use a clearly labeled capture of a real validated run, say "This is a previously captured run using the same validated store," and retime. Keep the capture label visible throughout playback.

## Slide 1: Manual root-cause analysis

### On-slide wording

BRIGHTWARD STREAMING / THE SITUATION

Live sports funded by subscriptions and advertising

- An on-call SRE must connect scattered evidence during an outage
- Collect signals
- Metrics, logs and
- recent changes
- Search for guidance
- Manually search runbooks
- and past incidents
- Choose the next check
- Reconcile guidance
- and find the owner
- Disruption puts viewer trust, advertising delivery and subscriptions at risk

### Timed rehearsal

#### 0:00-0:15

**Spoken narration**

Brightward Streaming is a fictional live sports service funded by subscriptions and advertising. When a stream freezes, the on-call engineer starts a manual root-cause investigation.

**On-screen action / pause - not spoken**

Show slide 1. Establish Brightward and the on-call SRE. Point to the three investigation steps without reading the slide as extra narration.

#### 0:15-0:30

**Spoken narration**

They gather signals, search runbooks and past incidents, reconcile guidance, and find the owner. That takes time while viewers wait. The opportunity is to reach a supported next step faster.

**On-screen action / pause - not spoken**

Move across Collect signals, Search for guidance, and Choose the next check. Hold briefly on the customer impact, then advance to slide 2 at 0:30.

## Slide 2: The OpenAI Platform & API

### On-slide wording

KNOWLEDGE / AGENT / REMEDIATION

A foundation for faster investigation and controlled remediation

- Vector Store
- Runbooks, past incidents and owners
- File Search retrieves relevant passages
- Agent
- Model, instructions and selected tools
- Investigate, propose steps, call tools
- CURRENT DEMO: RESPONSES API + FILE SEARCH
- Review a grounded, cited investigation plan
- Future: scoped tools for approved or low-risk automatic remediation

### Timed rehearsal

#### 0:30-0:49

**Spoken narration**

The OpenAI Platform and API provide the building blocks. A vector store holds operational knowledge, and File Search retrieves relevant passages. An agent combines a model, instructions, and selected tools to guide an investigation.

**On-screen action / pause - not spoken**

Stay on slide 2. Point first to Vector Store, then Agent. Describe the roles at a high level. Keep all browser clicks for the separate demo after this slide.

#### 0:49-1:10

**Spoken narration**

Our app uses Responses and File Search to produce cited guidance for engineer review. Adding scoped action tools could support approved fixes, then automatic remediation for tested, low-risk cases. Let's see the Platform and the workflow.

**On-screen action / pause - not spoken**

Point to the current-demo statement, then the future-remediation line. At 1:10 leave the PDF for the prepared browser tabs. Do not advance to slide 3 yet. The current app does not invoke the saved Platform agent or execute fixes.

## Demo between slides 2 and 3: OpenAI Platform and application walkthrough

This is a browser walkthrough, not a PDF slide. Stay off the slides for the complete 1:10-4:00 segment, then return directly to slide 3.

### Timed rehearsal

#### 1:10-1:20

**Spoken narration**

Here are the ten indexed operational documents behind the demo.

**On-screen action / pause - not spoken**

Leave slide 2 and show the prepared evidence view of the actual remote vector store. Make its ten allowlisted files and completed indexing statuses readable. Match them to the current manifest before recording. Keep a capture label visible if this is a previously captured view.

#### 1:20-1:42

**Spoken narration**

In the Platform's Agents area, I can start from a template or a custom agent. For an SRE use case, I'd tailor the instructions, knowledge access, and tools, including which actions need approval.

**On-screen action / pause - not spoken**

Open the signed-in Platform Agents page, point to the verified custom-agent option and template gallery, then open the prepared SRE example. Show its instruction field and tool configuration. Keep credentials off screen. Show the preloaded customization instead of typing it all. Confirm account-specific labels and template availability before recording. Knowledge access needs an appropriate retrieval integration, and the application must enforce approvals.

#### 1:42-1:50

**Spoken narration**

This illustrates agent configuration. The demo app calls Responses and File Search directly.

**On-screen action / pause - not spoken**

Finish on the example configuration, then switch directly to the local app. Do not return to the PDF. The saved example is not the app's backend. Keep the synthetic-demo label visible.

#### 1:50-2:00

**Spoken narration**

Now, let's investigate the frozen stream.

**On-screen action / pause - not spoken**

In the app's Operations overview, click Investigate on the preloaded streaming alert. Confirm Incident notes and Focus question load, then click Generate triage brief once. The replay should be paused during preflight so other alerts do not distract. This ten-second slot includes navigation and a provisional generation wait.

#### 2:00-2:20

**Spoken narration**

These synthetic notes say playlists return HTTP two hundred, yet playback freezes and segments are missing. A successful response doesn't prove the live playlist is advancing.

**On-screen action / pause - not spoken**

Point to the supplied observations in Incident notes. Continue to the output only when the actual generated brief is ready. Keep the simulation and manual-input boundary clear. Measure the real wait during rehearsal.

#### 2:20-2:40

**Spoken narration**

The next check is to compare repeated origin and CDN samples. A cache change still depends on current evidence, scope, and owner approval.

**On-screen action / pause - not spoken**

Point to the supported comparison and missing evidence in the actual brief. Keep the cause conditional. Hold on the relevant recommendation for at least three seconds. Align this wording to the validated output.

#### 2:40-3:15

**Spoken narration**

This citation opens the source. The runbook connects frozen playback to playlist freshness. The explanation highlights a supporting passage, and the full document lets us check its context.

**On-screen action / pause - not spoken**

Click the numbered citation attached to the HTTP-200/playlist-freshness finding. Verify Live HLS playlist freshness (NS-RB-001). Show the selected statement, Why this passage is relevant, and the highlighted Retrieved excerpts. Wait for the relevance explanation before describing it. Expand Read full knowledge document to show the same passage in context. Hold silently for at least five seconds, then click Close ×. The explanation assesses evidence; it does not expose the retriever's internal reasoning or a similarity score. Stop if the returned passage does not support the spoken claim.

#### 3:15-3:25

**Spoken narration**

Now, the same workflow for compute.

**On-screen action / pause - not spoken**

Select Unhealthy EC2 application in Demo incident. The notes and Focus question change automatically. Click Generate triage brief once and pause for the second provisional generation wait. No PDF slide appears between the two cases.

#### 3:25-3:38

**Spoken narration**

EC2 checks pass, but the application is unhealthy and supplied disk use is ninety-six percent. We need to identify what's growing.

**On-screen action / pause - not spoken**

Point to the supplied disk observation and corresponding next checks in the actual brief. The assistant did not collect these metrics. Confirm disk-consumer and rotation checks against the current compute runbook during validation.

#### 3:38-3:55

**Spoken narration**

This past log-rotation incident gives us a lead to test. It doesn't confirm today's cause.

**On-screen action / pause - not spoken**

Open Historical case: debug logs filled an EC2 root volume. Verify NS-INC-004 and inspect the returned excerpt about debug logging and failed rotation. Hold silently for at least five seconds. Click Close ×. Do not substitute full-document content for missing retrieved evidence.

#### 3:55-4:00

**Spoken narration**

That gives the engineer an inspectable next check.

**On-screen action / pause - not spoken**

Switch directly from the app to slide 3 at 4:00. This ends the complete Platform and UI demo. All remaining presentation time belongs to value/guardrails and the final recap.

## Slide 3: Value and guardrails

### On-slide wording

VALUE / GUARDRAILS

Less search time, with evidence and control over actions

- 30% less time
- to a correct next step
- Unvalidated pilot target
- Compare with manual triage
- Potential: shorter disruption
- and stronger viewer trust
- MEASURE
- Time, correctness and citation support
- Unsafe advice, latency and cost
- GUARDRAILS
- Scoped access and current documents
- Retention rules and human review
- BEFORE AUTOMATIC ACTIONS
- Enforced permissions, rollback and recovery checks

### Timed rehearsal

#### 4:00-4:17

**Spoken narration**

The target is thirty percent less time to a correct next step. It's unvalidated. We'll compare assisted and manual triage, checking correctness and citation support alongside speed, unsafe recommendations, latency, and cost.

**On-screen action / pause - not spoken**

Return directly from the app to slide 3 at 4:00. Point to Unvalidated pilot target, then the measurement rows. Do not revisit slide 2 or open another demo tab.

#### 4:17-4:35

**Spoken narration**

Less searching could shorten disruption. Production use needs scoped access, current documents, retention rules, and human review. Automatic actions would also need enforced permissions, rollback, and recovery checks. Those controls extend beyond an agent's instructions.

**On-screen action / pause - not spoken**

Point to Guardrails and Before automatic actions. The benefit remains prospective and the controls are pilot requirements. Advance to slide 4 at 4:35.

## Slide 4: Next steps and recap

### On-slide wording

NEXT STEPS / RECAP

Knowledge supports triage. Controlled tools can support remediation.

- Validate
- Six cases, citation support, safety and actual API waits
- Pilot
- One SRE team, two incident types, manual baseline
- Expand
- Approved fixes first, then bounded automation
- Proposed next step: agree the pilot scope and success criteria

### Timed rehearsal

#### 4:35-4:51

**Spoken narration**

Next, validate the six evaluation cases and measure the real waits. Then pilot with one SRE team on these two incident types. Add approved remediation only after the evidence supports it, and expand automation gradually.

**On-screen action / pause - not spoken**

Show slide 4. Move across Validate, Pilot, and Expand. Treat these as next steps, not completed evaluation or pilot results.

#### 4:51-5:00

**Spoken narration**

The recap: shared knowledge, cited investigation, controlled action. The next decision is the pilot scope and success criteria.

**On-screen action / pause - not spoken**

Point to the proposed next step. Finish the final line, then hold the closing slide to 5:00. No further app or Platform demo follows.

## Product references

Official OpenAI documentation checked October 7, 2026. Signed-in Platform template names, account access and controls still need preflight before recording.

[File Search guide](https://developers.openai.com/api/docs/guides/tools-file-search): File Search retrieves passages from uploaded knowledge in vector stores. The Responses API can return search results for inspection.

[Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration): An agent combines model, instructions and tools. Saved configuration is separate from a working session and its integration with an application.

[SRE incident-response example](https://developers.openai.com/cookbook/examples/agents_api/apps/sev_bot/readme): This example investigates evidence and records rollback approval, but does not execute a deployment. It illustrates the separation between investigation, application-owned approval and execution.
