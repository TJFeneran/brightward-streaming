---
id: NS-INC-004
title: Historical case: debug logs filled an EC2 root volume
owner: Compute Operations
version: 1.1
review_date: 2026-10-06
service: Brightward production operations
document_type: incident_report
approval_status: approved
synthetic: true
---

# Historical case: debug logs filled an EC2 root volume

All incidents, metrics, teams, and procedures in this document are fictional.

## Prior incident, not the current incident

On 2026-08-14, the fictional playback-session API on instance ns-session-17 failed its application health check after a deployment. EC2 system and instance checks passed. The root filesystem reached 99% utilization and application writes reported no space left on device.

Investigators found that an unintended debug logging setting increased log growth while a configuration-path mismatch prevented the rotation job from processing the active application log. They confirmed the largest growing files, failed rotation job, configuration difference and time correlation before attributing the outage to this combination.

## Reviewed response and lesson

The application owner and Compute Operations corrected logging and rotation configuration with Incident Lead approval. They preserved relevant incident evidence and performed scoped, approved retention cleanup. Free space stabilized, rotation succeeded, application writes and health recovered, and representative user requests succeeded during the agreed observation period.

This case suggests checking log growth and rotation when a new incident has matching symptoms. It does not establish that any current instance has the same deployment setting, root cause, approved cleanup scope, or recovery. Follow current NS-RB-004, not an automatic replay of the historical response. Different disk consumers and healthy rotation would weaken this hypothesis.
