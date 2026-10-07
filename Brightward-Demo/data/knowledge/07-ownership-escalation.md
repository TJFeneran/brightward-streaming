---
id: NS-OWN-001
title: Streaming, compute and database ownership and escalation
owner: Reliability Operations
version: 2.2
review_date: 2026-10-06
service: Live video delivery
document_type: ownership_guide
approval_status: approved
synthetic: true
---

# Streaming, compute and database ownership and escalation

## Responsibilities

All teams, queues, and procedures below are fictional Brightward operating conventions. Queue names are role labels, not real endpoints or permission to send messages.

| Role | Responsibility | Synthetic queue |
| --- | --- | --- |
| On-call SRE | Own the investigation, incident timeline, fact/hypothesis separation, and evidence handoff | reliability-oncall |
| CDN Operations | Check distribution behaviors, cache policies, deployment state, origin mapping, and approved CDN changes | cdn-oncall |
| Streaming Operations | Check ingest, packager output, media availability, retention contract, and origin capacity | streaming-oncall |
| Viewer Access Operations | Investigate viewer credential validity, renewal, and access denials | viewer-access-oncall |
| Compute Operations | Review filesystem evidence, instance health, logging/rotation and approved host changes | compute-oncall |
| Application owner | Correlate deployments, application errors, logging configuration and user-facing health | application-oncall |
| Incident Lead | Coordinate impact assessment and approve exact remediation proposals after service-owner review | incident-lead |

## Routing and escalation

For active live-event playback disruption, the SRE opens an incident and involves the Incident Lead. Bring CDN Operations and Streaming Operations into an edge-versus-origin investigation when the failure layer is not yet established. Route a fresh-origin publishing gap primarily to Streaming Operations, an evidenced edge freshness discrepancy to CDN Operations, and an evidenced credential problem to Viewer Access Operations.

The handoff contains UTC observations, affected stream/rendition and sampled scope, exact sanitized paths, request correlation, known recent changes, attempted checks, competing hypotheses, and missing evidence. Avoid unsupported global-impact statements. A passing component health check does not close the incident when playback remains impaired.

If an owner is unavailable, guidance conflicts, or the target/scope cannot be established, escalate to the Incident Lead. Do not substitute a historical workaround for missing authority. The SRE may continue collecting evidence without assuming permission to execute remediation.

## Change authority

CDN changes follow NS-RB-003. The Incident Lead's recorded approval identifies the exact change, distribution/environment, scope, and expected impact. CDN Operations reviews configuration compatibility; Streaming Operations reviews origin impact and recovery checks. Approval does not replace either review. A service owner performs an approved action through its authorized operational process.

## Document authority and evidence limits

Current approved runbooks govern procedure. Approved historical incident reports preserve past observations; their actions do not override current runbooks. NS-RB-003 v2.0 supersedes the broad-invalidation practice in NS-INC-001. If equally authoritative current guidance genuinely conflicts, surface the conflict and ask the relevant owner or Incident Lead to resolve it; do not silently choose a convenient instruction.

Operational documents do not contain live monitoring results. Source text can support a check, but only incident evidence can establish whether that check passed. Exact affected-viewer counts and advertising loss require QoE/session data, a defined impact window, deduplication, and commercial reconciliation; missing data must remain explicit.

## Compute routing and authority

For an unhealthy application on an EC2 instance with disk pressure, involve Compute Operations and the application owner. Apply NS-RB-004 for diagnosis and conditional remediation; use NS-INC-004 only as a historical lead. The Incident Lead approves the exact reviewed action, scope, evidence preservation, rollback and recovery plan. The assistant has no access to production and does not execute changes.


## Database routing and authority

For catalog pool waits or RDS connection pressure, involve Database Operations and the catalog application owner. Database Operations owns effective connection limits, session/transaction evidence and database capacity review; the application owner owns pool settings, connection lifecycle, replica topology and worker deployments. Follow NS-RB-006 and NS-RB-007. Route a confirmed worker blocker to its owner as well. The Incident Lead approves the exact reviewed action and recovery plan. Moderate database CPU does not establish application health.
