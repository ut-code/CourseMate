default: start

LOCAL_DB := postgres://user:password@localhost:5432/database

setup: 
	if [ ! `command -v bun` ]; then echo 'ERR: Bun is required!'; exit 1; fi
	make sync
	@echo "auto setup is done. now do:"
	@echo "- edit server/.env.dev"
	@echo "- edit web/.env"
	@echo "- run make sync"

setup-ci: 
	if [ "" == ${DATABASE_URL} ]; then echo 'Please set DATABASE_URL_FOR_SQL_GENERATION!'; exit 1; fi
	make sync
	make generate-sql

sync: sync-server sync-web sync-root sync-common
	@echo '----------------------------------------------------------------------------------------------------------'
	@echo '| Most work is done. now running prisma-generate-sql (which might fail if .env.dev is not set configured)|'
	@echo '----------------------------------------------------------------------------------------------------------'
	make generate-sql || true

generate-sql:
	@cd server; \
		if command -v dotenv && command -v prisma; \
		then dotenv -e .env.dev -- prisma generate --sql; \
		else bunx dotenv -e .env.dev -- bunx prisma generate --sql; \
		fi

start: start-all # build -> serve
build: build-server build-web
serve: serve-all # serve only. does not build.
watch:
		(trap 'kill 0' SIGINT; make watch-web & make watch-server & wait)


test: export DATABASE_URL=$(LOCAL_DB)
test: export NEVER_LOAD_DOTENV=1
test: export UNSAFE_SKIP_AUTH=1
test: export FIREBASE_PROJECT_ID=mock-proj
test: export CORS_ALLOW_ORIGINS=http://localhost:3000,https://localhost:5173
test: dev-db
	cd server/src; ENV_FILE=../.env.dev bun test
	cd ./test; ENV_FILE=../server/.env.dev bun test
	docker stop postgres

prepare-deploy-web: sync-common
	cd web; bun install; bun run build
deploy-web:
	@if [ "${PORT}" == "" ]; then echo 'env PORT not found!'; exit 1; fi
	cd web; bun next start --port ${PORT}
prepare-deploy-server: sync-common sync-server generate-sql
deploy-server:
	cd server; bun src/main.ts

docker:
	@# deferring `docker compose down`. https://qiita.com/KEINOS/items/532dc395fe0f89c2b574
	trap 'docker compose down' EXIT; docker compose up --build

docker-watch:
	docker compose up --build --watch

seed:
	cd server; if command -v prisma; then prisma db seed; else bunx prisma db seed; fi

## server/.envをDATABASE_URL=postgres://user:password@localhost:5432/databaseにしてから行う
dev-db: export DATABASE_URL=$(LOCAL_DB)
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
	@cd server; if command -v prisma; then \
		prisma generate; prisma db push; else \
		bunx prisma generate; bunx prisma db push; fi
	@make seed
	@echo "Seeding completed."

# Sync (install/update packages, generate prisma, etc)

sync-web:
	cd web; bun install --frozen-lockfile
	# copy .env.sample -> .env only if .env is not there

sync-server:
	cd server; bun install --frozen-lockfile
	cd server; if command -v prisma; then prisma generate; else bunx prisma generate; fi
	# copy .env.sample -> .env only if .env is not there

sync-root:
	bun install --frozen-lockfile
sync-common:
	cd common; bun install --frozen-lockfile


# Static checks

## code style
style:
	if command -v biome; then biome check --write; else bunx @biomejs/biome check --write; fi
style-check:
	if command -v biome; then biome check; else bunx @biomejs/biome check; fi

## Deprecated commands, there warnings will be deleted in the future
lint:
	@echo 'DEPRECATED: `make lint` is deprecated. run `make style` instead.'
	@exit 1

format:
	@echo 'DEPRECATED: `make format` is deprecated. run `make style` instead.'
	@exit 1

format-check:
	@echo 'DEPRECATED: `make format-check` is deprecated. run `make style-check` instead.'
	@exit 1

# type checks
type-check: 
	make type-check-server
	make type-check-web

type-check-server:
	cd server; bunx tsc --noEmit

type-check-web:
	cd web; bunx tsc --noEmit


# Runner

start-all: build-web build-server
	make serve-all

build-web: 
	cd web; bun run build
build-server: 
	cd server; bun run build

serve-all:
	(trap 'kill 0' EXIT; make serve-web & make serve-server & wait)
serve-web:
	cd web; bun run preview # todo: make serve function
serve-server:
	cd server; bun run serve 

watch-web: 
	cd web; bun run dev
watch-server: 
	cd server; bun run dev

.PHONY: test
