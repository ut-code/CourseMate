default: start

LOCAL_DB := postgres://user:password@localhost:5432/database

test: export DATABASE_URL=$(LOCAL_DB)
test: export DIRECT_URL=$(LOCAL_DB)
test: export UNSAFE_SKIP_AUTH=1
test: export FIREBASE_PROJECT_ID=mock-proj
test: export CORS_ALLOW_ORIGINS=http://localhost:3000,https://localhost:5173
test: dev-db
	cd server/src; ENV_FILE=none bun test
	cd ./test; ENV_FILE=none bun test
	docker stop postgres

## server/.envをDATABASE_URL=postgres://user:password@localhost:5432/databaseにしてから行う
dev-db: export DATABASE_URL=$(LOCAL_DB)
dev-db: export DIRECT_URL=$(LOCAL_DB)
dev-db: export NEVER_LOAD_DOTENV=1
dev-db:
	docker stop postgres || true
	@docker run --rm --name postgres -d \
	  -p 5432:5432 \
	  -e POSTGRES_PASSWORD=password \
	  -e POSTGRES_USER=user \
	  -e POSTGRES_DB=database \
	  postgres:alpine
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 2 # PostgreSQLが起動するまでの待機（必要に応じて調整）
	@until docker exec postgres pg_isready -U user -d database; do \
		echo "Waiting for PostgreSQL to be ready..."; \
		sleep 1; \
	done
	@echo "PostgreSQL is ready. Running seed..."
	@cd server; bunx prisma generate --sql; bunx prisma db push
	@bun run seed
	@echo "Seeding completed."

