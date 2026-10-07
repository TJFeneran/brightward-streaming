---
id: NS-RB-006
title: RDS PostgreSQL connection pressure and application timeouts
owner: Database Operations
version: 1.0
review_date: 2026-10-06
service: Catalog API and RDS PostgreSQL
document_type: runbook
approval_status: approved
synthetic: true
---

# RDS PostgreSQL connection pressure and application timeouts

## Scope and semantic cues

This fictional Brightward procedure covers catalog requests that stall while acquiring a database session. Reports such as “the database looks healthy but requests are queuing,” “cannot borrow a connection,” and “catalog pages time out after scaling” can describe connection pressure rather than slow SQL execution. A pool acquisition timeout measures waiting for a connection; it does not by itself identify a slow query.

An available RDS instance with moderate CPU can still lack usable connection slots. Open idle sessions consume slots, while sessions idle inside a transaction can also retain locks. CloudWatch DatabaseConnections is a signal to correlate with PostgreSQL session state and application pool observations, not a complete count of every backend or proof of the responsible client.

## Brightward operating contract

The fictional production writer is `bw-catalog-db`. The catalog API connects directly to RDS PostgreSQL; no RDS Proxy is present in this demo. The last reviewed connection limit is 500, with a total application budget of 450 across catalog replicas, workers and other clients. These are Brightward assumptions, not AWS defaults; verify effective settings and reserved headroom during an incident.

The approved catalog pool maximum is 15 per process. Replica count and processes per replica both matter: aggregate possible sessions equal replicas × processes per replica × per-process pool maximum, plus other clients and deployment overlap. A configured pool ceiling is potential demand, not a measurement of established connections. Increasing replicas can exhaust a shared database budget even if CPU stays moderate.

## Evidence to collect

1. Align UTC timestamps for catalog errors, pool acquisition latency, DatabaseConnections, CPU, freeable memory, database events and application scaling. Confirm the writer endpoint, environment and affected request scope. Separate pool wait time from SQL execution time and distinguish connection rejection from DNS, network or credential failures.
2. Through the approved operator path, inspect effective `max_connections`, role limits and reserved slots, and a sanitized `pg_stat_activity` summary by application, state, transaction age and wait event. Check lock blockers and long-running transactions. Do not expose customer query text, credentials or connection strings.
3. Compare deployed image/configuration and actual replica/process counts with the reviewed pool budget. Include rollout overlap and workers. A merged pool change or submitted deployment is not proof of the running value. Use NS-INC-005 as a hypothesis to test, not today's diagnosis.

## Decision points

- Many catalog sessions with rising replica count and confirmed oversized pools: investigate aggregate demand exceeding the shared budget. Review a bounded pool/concurrency correction under NS-RB-007.
- Long transactions, lock waits or a dominant worker: investigate the transaction owner and workload before blaming pool size. A job holding a connection while doing external work can extend occupancy.
- Low database connection use but pool waits in one service: investigate local leaks, unreleased sessions, pool limits and slow calls. Raising the database limit may not help.
- Connection counts disagree with application symptoms: validate endpoint, observation window and metric granularity; do not fill in missing state.

## Technical reference

[AWS: initial RDS PostgreSQL troubleshooting](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.InitialTroubleshooting.html) supports inspecting connection state and application connection handling. Brightward budgets, resource names and review rules above are fictional.
