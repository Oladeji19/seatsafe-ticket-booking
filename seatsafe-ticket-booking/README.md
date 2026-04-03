# SeatSafe

SeatSafe is a full-stack ticket booking platform built to showcase backend API design, relational data modeling, deployment readiness, and concurrency-safe booking logic for a software engineering resume.

## Why this project is resume-worthy

This project goes beyond a basic CRUD app by modeling a real booking workflow:
- JWT-based authentication for users and admins
- Event creation and seat inventory management
- Seat selection and booking history
- PostgreSQL-backed transactional booking flow
- `SELECT ... FOR UPDATE` row locking to prevent double-booking during concurrent requests
- Health check endpoint for operational monitoring
- Dockerized database setup for local development

## Tech stack

### Frontend
- React
- TypeScript
- Vite
- React Router

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- bcrypt
- Zod

### DevOps / Operations
- Docker Compose
- SQL bootstrap script
- Health endpoint for API / DB connectivity checks

## Architecture

```text
client/   -> React frontend for browsing events, booking seats, and admin event creation
server/   -> Express API for auth, events, and bookings
server/sql/init.sql -> schema + default admin seed
```

## Concurrency design

The most important backend feature is the booking transaction:
1. The API receives an event ID and selected seat IDs.
2. The server opens a database transaction.
3. Matching seats are fetched with `FOR UPDATE` locking.
4. If any seat is already unavailable, the transaction rolls back.
5. If all seats are available, the booking and booking items are inserted.
6. The selected seats are updated to `booked`.
7. The transaction commits.

This prevents two simultaneous requests from confirming the same seat.

## Run locally

### 1. Start PostgreSQL
```bash
docker compose up -d
```

### 2. Start the backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Update `.env` if your local database credentials differ.

### 3. Start the frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:4000`

## Default admin account

The SQL seed creates an admin account for local testing.

- Email: `admin@example.com`
- Password: `password123`

## Core API routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Events
- `GET /api/events`
- `GET /api/events/:eventId`
- `POST /api/events` (admin only)

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/me`

### Health
- `GET /api/health`

## Suggested next upgrades

These are strong follow-up improvements if you want to make the GitHub repo even more impressive:
- Add Redis-based seat hold expiration
- Add payment simulation with idempotency keys
- Add integration tests for concurrent booking attempts
- Add GitHub Actions CI for linting, tests, and builds
- Deploy the frontend and backend separately
- Add role-based admin analytics dashboard

## Resume framing

This repo is designed so you can honestly describe work like:
- building a full-stack booking platform with React, Node.js, TypeScript, and PostgreSQL
- designing transactional booking APIs with concurrency control
- modeling relational schemas for users, events, seats, bookings, and booking items
- shipping deployment-ready code with Docker-based local infrastructure
