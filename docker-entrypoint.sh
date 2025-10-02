#!/bin/sh
set -e

echo "⏳ Waiting for Postgres to be ready..."
node src/config/wait-for-db.ts

echo "Seeding database..."
npm run seed

echo "🚀 Starting API server..."
exec "$@"
