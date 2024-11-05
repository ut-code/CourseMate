default: start

LOCAL_DB := postgres://user:password@localhost:5432/database

setup: 
	if [ ! `command -v bun` ]; then echo 'ERR: Bun is required!'; exit 1; fi
	make sync
	bunx husky
	cd web; if [ ! -f .env ]; then cp ./.env.sample ./.env ; fi
	cd server; if [ ! -f .env.dev ]; then cp ./.env.sample ./.env.dev ; fi
	@echo "auto setup is done. now do:"
	@echo "- edit server/.env.dev"
	@echo "- edit web/.env"
	@echo "- run make sync"

setup-ci:
	if [ ${DATABASE_URL} == "" ]; then echo 'Please set DATABASE_URL_FOR_SQL_GENERATION!'; exit 1; fi
	make sync
	make generate-sql

sync: sync-server sync-web sync-root copy-common 
	@echo '----------------------------------------------------------------------------------------------------------'
	@echo '| Most work is done. now running prisma-generate-sql (which might fail if .env.dev is not set configured)|'
	@echo '----------------------------------------------------------------------------------------------------------'
	make generate-sql || true

generate-sql:
	@cd server; bun run prisma-generate-sql

start: start-all # build -> serve
build: build-server build-web
serve: serve-all # serve only. does not build.
watch:
		(trap 'kill 0' SIGINT; make watch-web & make watch-server & wait)


test: export DATABASE_URL=$(LOCAL_DB)
test: export NEVER_LOAD_DOTENV=1
test: export UNSAFE_SKIP_AUTH=1
test: export FIREBASE_PROJECT_ID=mock-proj
test: dev-db
	cd server/src; ENV_FILE=../.env.dev bun test
	cd ./test; ENV_FILE=../server/.env.dev bun test
	docker stop postgres

prepare-deploy-web: copy-common
	cd web; bun install; bun run build
prepare-deploy-server: copy-common sync-server generate-sql
deploy-server:
	cd server; bun src/main.ts

docker: copy-common
	@# deferring `docker compose down`. https://qiita.com/KEINOS/items/532dc395fe0f89c2b574
	trap 'docker compose down' EXIT; docker compose up --build

docker-watch: copy-common
	docker compose up --build --watch

seed:
	cd server; bunx prisma db seed

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
	@sleep 5 # PostgreSQLが起動するまでの待機（必要に応じて調整）
	@until docker exec postgres pg_isready -U user -d database; do \
		echo "Waiting for PostgreSQL to be ready..."; \
		sleep 1; \
	done
	@echo "PostgreSQL is ready. Running seed..."
	@cd server; bunx prisma generate; bunx prisma db push; cd ..
	@make seed;
	@echo "Seeding completed."


precommit: check-branch lint-staged spell-check

lint-staged:
	bunx lint-staged
check-branch:
	@ if [ "$(git branch --show-current)" == "main" ]; then echo "Cannot make commit on main! aborting..."; exit 1; fi
spell-check:
	bunx cspell --quiet .

# Sync (install/update packages, generate prisma, etc)

sync-web:
	cd web; bun install --frozen-lockfile
	# copy .env.sample -> .env only if .env is not there

sync-server:
	cd server; bun install --frozen-lockfile
	cd server; bunx prisma generate
	# copy .env.sample -> .env only if .env is not there

sync-root:
	bun install --frozen-lockfile


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
type-check: copy-common
	make type-check-server
	make type-check-web

type-check-server:
	cd server; bunx tsc --noEmit

type-check-web:
	cd web; bunx tsc --noEmit


# Runner

start-all: build-web build-server
	make serve-all

build-web: copy-common-to-web
	cd web; bun run build
build-server: copy-common-to-server
	cd server; bun run build

serve-all:
	(trap 'kill 0' EXIT; make serve-web & make serve-server & wait)
serve-web:
	cd web; bun run preview # todo: make serve function
serve-server:
	cd server; bun run serve 

watch-web: copy-common-to-web
	cd web; bun run dev
watch-server: copy-common-to-server
	cd server; bun run dev

copy-common: copy-common-to-server copy-common-to-web
copy-common-to-server:
	@ if [ -d server/src/common ]; then rm -r server/src/common; fi
	@ cp -r common server/src/common
copy-common-to-web:
	@ if [ -d web/common ]; then rm -r web/common; fi
	@ cp -r common web/common

.PHONY: test
