Running the CRM Backend with Docker

This project is a Node.js + TypeScript backend using PostgreSQL. Docker is used to simplify setup and environment management.

Prerequisites

Docker ≥ 24.x

Docker Compose ≥ 2.x

Node.js ≥ 20 (for local development)

Environment Variables

Create a .env file in the project root with the following:

PORT=4000
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=crmdb

Docker Setup

1. Build and start containers
   docker compose up --build

This command will:

Start PostgreSQL container (db) and initialize the database.

Start the Node.js API container (crm-api) after waiting for the database to be ready.

Run the seed script automatically if the database is empty.

2. API Endpoints

Health check:

GET http://localhost:4000/health

Example resource:

POST http://localhost:4000/customers
Content-Type: application/json

3. Stop containers
   docker compose down

Notes

The backend waits for Postgres to be ready before running seeds and starting the server.

The database seed script is safe to run multiple times; it will skip if tables already exist.

Node image used is node:20 (LTS) for stable production use.
