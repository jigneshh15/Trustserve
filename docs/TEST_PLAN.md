# TrustServe Software Test Plan

## Objective
Verify the core TrustServe flows: service discovery, booking creation, fair-price calculation, society group booking, SafeVisit demo workflow, admin status update, API validation and export.

## Scope
In scope: frontend interactions, browser-local demo storage, REST health/services/bookings/status/metrics/export, responsive layout, input validation.
Out of scope: real payments, real identity/background checks, emergency dispatch, live GPS tracking, production-grade authentication, third-party messaging.

## Test levels and tools
- Unit: JUnit 5 for Java service logic (extend with repository/service tests).
- Integration: Spring Boot test client / Postman.
- System: browser end-to-end walkthrough.
- Acceptance: student team and 3–5 volunteer users.
- Non-functional: basic concurrent API requests, mobile viewport review, security input review.

## Environment
Java 17, Maven 3.9+, modern Chrome/Firefox, H2 in-memory DB, Docker. Use test data only.

## Entry criteria
Build succeeds; test environment available; test data prepared.
## Exit criteria
All critical cases pass or have documented defects; no unresolved critical defect; cloud smoke test recorded.

## Defect log template
| ID | Severity | Priority | Steps to reproduce | Expected / Actual | Status | Fix |
|---|---|---|---|---|---|---|
| BUG-001 | Medium | P2 | Sample row; replace with actual defect | Document evidence | Open | Pending |

## Test summary template
Record planned/executed, pass/fail/blocked, coverage report, defects found/fixed/open, regression evidence and lessons learned. Do not claim tests passed until run and evidence captured.
