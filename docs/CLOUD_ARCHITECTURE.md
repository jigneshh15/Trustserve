# Cloud Architecture and Deployment Notes

## Prototype architecture
Browser (responsive frontend) → HTTPS reverse proxy / web layer → Spring Boot REST API → H2 database (demo). CSV export uses application file storage. Docker packages the API.

## Suggested public-cloud architecture
- Static frontend: object storage + CDN.
- API: managed container app / PaaS.
- Database: managed PostgreSQL with backups.
- Object storage: private bucket for permitted uploads and exports.
- Secrets: cloud secret manager; never commit credentials.
- IAM: least-privilege service roles.
- Network: HTTPS, private database networking, restricted admin endpoints.
- Monitoring: application logs, health endpoint, request/error metrics and alerts.
- Reliability: database backups, restore drills, multi-zone deployment when budget allows.
- Scale: stateless API replicas behind managed load balancer; managed database scaling.

## Service model
PaaS/container application hosting is appropriate for a small team that wants to deploy an application without managing physical servers. Managed database and object storage reduce operational burden.

## Cost-estimation method
Obtain live prices from the chosen cloud provider before submission. Estimate monthly cost at 100, 1,000 and 10,000 users using: compute hours + database tier + storage + outbound bandwidth + logging/monitoring + backups. Do not invent a fixed cost without provider, region, usage assumptions and pricing date.

## Security checklist
- HTTPS in production.
- Secrets in environment variables or secret manager.
- Password hashing (Argon2/bcrypt) and secure sessions/JWT before real users.
- Role-based access control for customer, professional and admin.
- Validate inputs; protect against injection, XSS, CSRF and abuse.
- Encrypt data at rest and in transit.
- Consent, retention and deletion process for personal data.
