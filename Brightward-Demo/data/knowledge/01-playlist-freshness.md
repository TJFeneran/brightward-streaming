---
id: NS-RB-001
title: Live HLS playlist freshness
owner: CDN Operations
version: 2.1
review_date: 2026-10-06
service: Live video delivery
document_type: runbook
approval_status: approved
synthetic: true
---

# Live HLS playlist freshness

## Scope and operating contract

This synthetic Brightward runbook applies to conventional sliding-window live HLS media playlists. A master playlist selects renditions; inspect the selected media playlist to judge progression. An ended stream or an unchanged master playlist requires different interpretation.

Brightward's approved live-media-playlist policy, `live-manifest-short-v1`, uses Minimum TTL 0, Default TTL 2, and Maximum TTL 6 seconds. The fictional origin normally publishes an update every two seconds with `Cache-Control: max-age=2`. These are Brightward assumptions, not AWS defaults. Immutable media segments have a separate cache policy; their longer lifetime does not justify extending playlist caching.

HTTP 200 establishes that a response was served. It does not establish that the live timeline advanced or that every referenced segment is playable. A packager liveness check does not test the complete viewer path.

## Evidence to collect

Record the UTC sample time, stream, rendition, media-playlist path, device/app, and location. Retain sanitized request identifiers and headers; omit signatures, cookies, tokens, and viewer identifiers. Obtain origin samples only through the approved operator access path.

For the same stream and rendition, collect repeated CDN and origin samples over approximately ten seconds. Compare `EXT-X-MEDIA-SEQUENCE`, listed segment URIs, and segment timing where available. Sequence numbers identify positions within a playlist; do not compare unrelated renditions or streams as if their sequence spaces were identical. Exclude stream restarts and discontinuities before interpreting a mismatch.

Record `Age`, `X-Cache`, and relevant response cache headers when present. Missing headers do not establish a cache miss; one high-age response or high hit ratio is insufficient to establish the cause.

## Decision points

- **Origin advances; affected CDN copy does not:** investigate the effective cache behavior, policy, cache key, and recent configuration change. Establish the actual matching behavior and deployed state; a submitted update is not proof of propagation.
- **Neither advances:** involve Streaming Operations to investigate ingest and packaging. A CDN rollback alone is not supported by that observation.
- **Both advance; segment requests fail:** correlate each failure with its referencing playlist, authorized origin response and request timing; involve Streaming Operations. Do not infer a cache cause from status codes alone.
- **Only one client group fails:** compare client requests and access evidence before concluding a global CDN issue.

## Cache interpretation and action boundary

Compare Minimum TTL with origin freshness headers. CloudFront can retain content according to a larger configured minimum despite a shorter origin lifetime. A viewer's request-side `Cache-Control` or `Pragma` does not force CloudFront to re-fetch from origin. Inspect the active configuration instead of assuming browser refresh bypasses it.

A recent change plus similar history supports a hypothesis, not a confirmed diagnosis. NS-INC-001 is a precedent, not evidence about today's stream. Apply NS-RB-003 before proposing changes; use NS-OWN-001 for escalation. Do not invent origin observations that have not been supplied.

## Technical references

- AWS: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html
- HLS terminology: https://www.rfc-editor.org/rfc/rfc8216.html

References ground protocol behavior; Brightward thresholds and procedures are fictional.
