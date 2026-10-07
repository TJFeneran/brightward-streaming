---
id: NS-RB-007
title: RDS and application pool change review and recovery
owner: Database Operations
version: 1.0
review_date: 2026-10-06
service: Catalog API and RDS PostgreSQL
document_type: runbook
approval_status: approved
synthetic: true
---

# RDS and application pool change review and recovery

## Authority and prerequisites

This is a fictional Brightward change procedure. Apply NS-RB-006 first. The on-call SRE gathers evidence; Database Operations reviews database capacity, sessions and transaction impact; the application owner reviews pool lifecycle, replica counts and deployment compatibility. The Incident Lead approves the exact environment, target, scope, rollback and verification plan. The assistant recommends checks and performs no changes.

Before proposing remediation, establish the effective connection budget, client ownership, running pool configuration, deployment state and whether long transactions or locks are contributing. A successful infrastructure health check is insufficient to declare the catalog recovered. Do not derive a safe connection limit from an old incident or a PR diff.

## Conditional response

If confirmed aggregate pool demand exceeds the reviewed budget, the application owner and Database Operations should review restoring a compatible pool/concurrency setting and draining connections in bounded batches. Include deployment overlap and every client in the budget. Account for the risk that reducing concurrency can increase queued requests. Record a rollback threshold and preserve service capacity before approval.

If a specific batch job or long transaction is evidenced as the blocker, review pausing or correcting that workload with its owner. Establish transaction rollback cost, retry behavior and data consistency before any targeted cancellation. Do not recommend mass session termination, indiscriminate database restart, or automatically raising `max_connections` as a generic fix. Adding replicas may worsen connection pressure.

Database parameter, instance-size, failover or proxy changes require their own capacity and availability review. Check whether a parameter is pending or effective and whether the proposed change requires a maintenance action. A new proxy is a design option for later evaluation, not proof of an immediate recovery path.

## Recovery evidence

For this demo, the reviewed recovery window is five minutes: catalog success rate returns to its pre-incident baseline, pool acquisition p95 falls below the fictional 100 ms service target, established application sessions remain within the agreed budget, and connection rejections stop. Confirm progress for representative catalog operations while watching transaction age, locks and queue depth. Recovery is observed only after these checks pass; a merged PR or completed rollout alone is not recovery.

## Evidence handoff

Record before/after UTC samples, source of each setting, approved change identity, affected clients, deployment overlap and any remaining unknowns. Use NS-OWN-001 for escalation. Historical actions in NS-INC-005 do not override this current procedure.
