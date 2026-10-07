---
id: NS-RB-004
title: EC2 application health and disk-pressure triage
owner: Compute Operations
version: 1.1
review_date: 2026-10-06
service: Brightward production operations
document_type: runbook
approval_status: approved
synthetic: true
---

# EC2 application health and disk-pressure triage

All incidents, metrics, teams, and procedures in this document are fictional.

## Establish the failure layer

An application health endpoint failing on an EC2 instance is not the same as an EC2 system or instance status-check failure. Record application, instance, environment, UTC timeline, deployment version, and affected scope. Passing EC2 checks do not establish application health. The assistant has no telemetry access: every current metric must come from the engineer's supplied snapshot or a requested follow-up check.

## Prioritized evidence

1. Ask Compute Operations to verify filesystem bytes and inode utilization for the affected mount, trend, and available headroom; correlate application write failures with their timestamps. A high utilization observation alone does not prove the failed health endpoint was caused by disk pressure.
2. Identify which directories/files are growing, whether deleted files remain open, and the responsible process. Compare the deployed logging level, rotation configuration, rotation job status and last successful rotation with the known-good version. Disk data comes from OS or separately configured monitoring; do not imply standard EC2 metrics supplied it automatically.
3. Correlate the application deployment and errors. Check whether log growth actually explains the consumed space. Consider artifacts, temporary data, or inode exhaustion when log evidence does not match. NS-INC-004 is a useful historical lead only when current evidence supports its mechanism.

## Conditional resolution and recovery

If excess debug logging plus failed rotation is confirmed, the application owner and Compute Operations propose restoring the approved logging/rotation configuration. Preserve relevant evidence and establish retention requirements, exact paths, scope, rollback, available capacity and service impact before any cleanup, restart, deployment rollback or storage change. The Incident Lead approves the exact proposal; an authorized owner executes it. Never recommend blanket log deletion or assume a restart frees space.

Verify available bytes/inodes and growth trend, successful rotation, application writes and health, and representative user requests over an agreed observation window. Recovery is not confirmed until these observations are supplied. If rotation works and another directory explains growth, investigate that owner and cause instead of repeating the historical fix.
