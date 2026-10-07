---
id: NS-INC-005
title: Catalog timeouts after replica growth multiplied database pools
owner: Database Operations
version: 1.0
review_date: 2026-10-06
service: Catalog API and RDS PostgreSQL
document_type: incident_report
approval_status: approved
incident_date: 2026-09-09
synthetic: true
---

# Catalog timeouts after replica growth multiplied database pools

## Historical observations

In this fictional September 9 incident, catalog requests queued waiting for database sessions while RDS remained available and CPU stayed below 40%. DatabaseConnections rose sharply and the application reported connection acquisition timeouts. These observations initially resembled a slow database, but did not establish that queries themselves were expensive.

Investigators verified one process per replica, a running pool maximum of 30 and an increase from 10 to 20 replicas. Potential catalog demand therefore rose from 300 to 600 connections, before workers and rollout overlap, against that incident's reviewed total application budget of 450. A session snapshot attributed most sessions to the catalog service; many were idle, and there was no dominant lock blocker. These effective settings and client attribution, not the scaling timestamp alone, supported the diagnosis.

## Reviewed response and observed recovery

Database Operations and the application owner reviewed a pool maximum of 15 against the replica count and other clients. After Incident Lead approval, the application owner used a staged rollout with connection draining and monitored queue depth. In that historical incident, connections fell within budget, acquisition p95 returned below 100 ms, and connection rejection stopped over the five-minute observation window. No database reboot or increase to `max_connections` was used.

## Applicability to a new incident

The useful similarity is an application waiting for database access despite moderate database CPU, especially after replica or pool changes. It suggests checking aggregate connection demand and session ownership. It does not establish today's pool value, replica topology, budget or transaction state. A worker holding long transactions, a pool leak or a lock wait can produce related symptoms and require a different response.

Use the current NS-RB-006 diagnosis and NS-RB-007 change procedure. Do not copy the old pool value without validating the current workload and approved capacity. All counts and recovery observations above belong only to this historical example.
