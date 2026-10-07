---
id: NS-INC-001
title: Harbor Cup playlist lag after a cache-policy change
owner: CDN Operations
version: 1.1
review_date: 2026-10-06
service: Live video delivery
document_type: incident_report
approval_status: approved_historical_record
incident_date: 2026-07-18
synthetic: true
---

# Harbor Cup playlist lag after a cache-policy change

## Historical scope

This synthetic report describes a resolved incident affecting the fictional Harbor Cup stream. It is a historical record, not proof of a current incident and not an executable runbook. Historical change instructions below are superseded by NS-RB-003 v2.0.

## Symptoms and evidence

Viewer playback stalled while media-playlist responses continued returning 200. The initial incident report also noted an elevated cache hit ratio, but the team did not treat that metric as proof of causation.

Repeated observations of the same affected rendition showed its origin playlist progressing while sampled CDN copies repeated the same segment list. Origin publication checks showed that current segments existed. Configuration review established that a cache-policy association introduced for long-lived assets had also reached Harbor Cup's media-playlist behavior.

The historical policy imposed a 60-second minimum cache lifetime. The origin requested two-second freshness. This discrepancy and the repeated edge/origin comparison—not the deployment timestamp alone—established the cache behavior as the cause of the observed lag. Not every sampled location showed the same lag at the same time.

## Resolution and observed outcome

CDN Operations restored the compatible short-lived playlist policy after operational review. Following deployment and cache refresh, sampled edge playlists advanced again and the affected playback checks succeeded. These qualitative results are synthetic historical observations; the report provides no current viewer-loss or financial-impact estimate.

The historical response also included a distribution-wide `/*` invalidation. That decision caused avoidable cache-miss traffic beyond the affected playlists. It is recorded to explain what happened, not to recommend repeating it.

## Superseded practice — do not use as the current procedure

The broad invalidation described above is superseded by NS-RB-003 v2.0, reviewed September 25, 2026. Current guidance requires diagnosis, a compatible policy target, origin-load review, explicit approval, and the smallest justified playlist invalidation scope. Invalidation without correcting an unsuitable policy can recreate the problem on later fills.

## Applicability and limits

Use this incident to motivate a freshness comparison when the origin advances but a matching edge copy does not. Consult NS-RB-001 and NS-RB-003 for current checks. Do not import this incident's TTL, affected stream, confirmed cause, or authorization into a new case.

If fresh origin playlists reference missing segments, investigate publishing and media availability with Streaming Operations. If token-validity evidence explains denied requests, involve Viewer Access Operations. Missing observations must remain missing; a similar headline does not fill them in.
