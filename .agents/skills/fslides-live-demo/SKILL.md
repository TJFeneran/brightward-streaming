---
name: fslides-live-demo
description: Build or test an explicitly requested interactive API demo inside an fslides slide. Brightward's current demo runs outside the deck, so ordinary presentation work does not activate this workflow.
---

# Explicitly requested live demo slides

Brightward currently uses the existing local application between slides 2 and 3.
Keep that plan unless the user requests an embedded slide. Reuse the existing
application and data boundary where feasible rather than introducing a parallel
backend or changing retrieval behavior.

For a requested interactive slide, provide idle, working, ready-for-review and
error states. Generation remains an explicit user action. Show honest elapsed
time if the service supplies no progress percentage. Do not invent progress or
show a fabricated answer when a live call fails.

A recorded result may be used only when authorized, with its provenance and a
visible sample/recorded label. Preserve failure evidence and a retry action.
Published static slides cannot run the local backend; explain that in the notes.

Keep API credentials in the existing server's ignored credential storage. Do not
read, print or embed keys in a slide, export, manifest or speaker notes. Any new
helper must validate requests and use narrow routes. Use the current real API
contract, not the example presentation's autonomous-remediation claims.

Test the explicit trigger, working state, returned evidence and failure/retry.
Inspect screenshots and source citations. Mocked tests do not validate live answer
quality. Preserve the synthetic-demo label and distinguish suggestions from
infrastructure actions.

Adapted from fslides/fslides, commit 14de21ea389491e917fcdee3683ff41557127762.
