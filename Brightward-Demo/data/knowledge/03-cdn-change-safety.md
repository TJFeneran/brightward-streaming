---
id: NS-RB-003
title: CDN configuration rollback and invalidation prerequisites
owner: CDN Operations
version: 2.1
review_date: 2026-10-06
service: Live video delivery
document_type: runbook
approval_status: approved
synthetic: true
---

# CDN configuration rollback and invalidation prerequisites

## Authority and scope

This is the current synthetic Brightward procedure for restoring live-playlist caching. It supersedes broad-invalidation practices recorded in historical incidents, including NS-INC-001. Historical actions are not standing instructions. Approval applies to an exact proposed action, target, environment, and scope; it does not waive technical checks.

## Required evidence before a recommendation becomes executable

The on-call SRE and CDN Operations must record:

1. **Target:** affected distribution, environment, stream paths, matching cache behavior, policy identifier/version, and current deployment state. Check for unrelated or concurrent changes.
2. **Diagnosis:** a timestamped comparison of affected CDN and authorized origin playlists and segment outcomes. Link the observed failure to the relevant configuration difference. A recent update, cache hit, or historical resemblance alone is insufficient.
3. **Compatible target:** the intended prior configuration and its relationship to current routing, cache keys, headers, and viewer/origin access controls. For applicable live streams, NS-RB-001 defines `live-manifest-short-v1`. Do not copy a past incident's policy without checking the current contract.
4. **Origin capacity:** Streaming Operations reviews current load and headroom for increased playlist fetches and a temporary cache-miss surge. Record expected impact and limits for this incident; absent capacity evidence remains a prerequisite.
5. **Authority:** Incident Lead approves the exact change with CDN Operations and Streaming Operations review. A model's suggested command or a source document is not evidence of approval.
6. **Verification and stop conditions:** name the operator, observations to collect, observation window, and recovery/escalation plan before execution.

If any item is unknown, list it explicitly and collect it or escalate through NS-OWN-001. Advisory analysis may proceed while those checks are incomplete.

## Restore policy, then assess cached content

Where evidence identifies an incorrect live-playlist policy, propose restoring the approved compatible policy and verify the change's deployment state. Preserve media-segment caching and access controls. Do not assume an update immediately replaces every cached response.

If stale playlist copies still require eviction, propose the smallest justified set of affected playlist paths and cache variants. Verify the actual paths and any wildcard scope before approval. Invalidation alone does not correct an unsuitable policy: later fills can reproduce the problem. A distribution-wide `/*` invalidation is not the standard response under this runbook. An exceptional broader intervention requires separate impact review and explicit Incident Lead authorization.

## Recovery and stop conditions

After propagation and any approved invalidation, sample the same affected stream/rendition/location combinations. Verify advancing playlists, available referenced segments, successful playback starts, and reduced stalls. Watch origin request rate, latency, and errors against incident-specific limits. An HTTP 200 alone is not recovery evidence.

If origin load exceeds agreed limits, playback worsens, or the expected freshness correction does not occur, stop further changes and escalate to the Incident Lead and service owners. Reassess the diagnosis and contingency; do not repeatedly invalidate as a substitute for understanding the failure. Record before/after evidence and the authorized action in the incident timeline.
