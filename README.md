# TrustServe — Trusted Services. Verified Professionals.

A responsive home-services marketplace MVP built for the B.Tech Semester 5 integrated project brief.

## Included
- Responsive customer website (HTML/CSS/vanilla JS)
- Service catalogue: Cleaning, Plumbing, Electrical Work, Tutoring
- Customer registration/login demo, booking flow, booking history
- Society group booking, fair-price estimate, SafeVisit check-in simulation
- Professional listing and admin dashboard
- Java 17 + Spring Boot REST backend, H2 database, validation, custom exceptions
- Java OOP model, inheritance, file export, background task executor
- Dockerfile, docker-compose, GitHub Actions CI, test-plan starter and 30 test cases

## Run the website (frontend demo)
Open `frontend/index.html` in a browser. For the best experience, use VS Code Live Server.

The frontend stores demo data in browser localStorage. This is suitable for a classroom demonstration, not production authentication or payment processing.

## Run the Java backend
Requirements: Java 17+ and Maven 3.9+.

```bash
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`
Health: `http://localhost:8080/api/health`
Services: `http://localhost:8080/api/services`
Bookings: `http://localhost:8080/api/bookings`

H2 console: `http://localhost:8080/h2-console`
JDBC URL: `jdbc:h2:mem:trustserve`
Username: `sa`
Password: (blank)

## Run with Docker
From project root:
```bash
docker compose up --build
```
Backend is exposed on port 8080. Frontend is served at `http://localhost:8081`.

## Important demo / academic notes
- The price estimator is a transparent rule-based prototype, not a trained AI model.
- SafeVisit is a simulated check-in workflow. It does not contact emergency services or provide live tracking.
- Payment is demo-only; no real money is collected.
- Professional verification status is sample/demo data. Do not present it as a real background check.
- Before public launch, add secure password hashing, JWT/session security, HTTPS, rate limiting, audit logs, consent flows, real identity verification, payment gateway test integration, and privacy/legal review.

## Suggested demo flow
1. Open the website and browse the service cards.
2. Create a demo account and sign in.
3. Request a service and submit a booking.
4. Open My Bookings and view the booking status.
5. Try Society Group Booking and the Fair Price estimator.
6. Open SafeVisit and simulate a visit check-in.
7. Open Admin to view bookings and change their status.
8. Start the backend and show `/api/health` and `/api/bookings`.

## Project structure
```
TrustServe/
  frontend/        Responsive website
  backend/         Java Spring Boot REST API
  docs/            Testing, business, cloud and pitch notes
  .github/         CI workflow
  Dockerfile
  docker-compose.yml
```
