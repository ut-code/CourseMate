default: start

setup: 
	if [ ! `command -v bun` ]; then echo 'ERR: Bun is required!'; exit 1; fi
	make sync
	bunx husky
	cd web; if [ ! -f .env ]; then cp ./.env.sample ./.env ; fi
	cd server; if [ ! -f .env ]; then cp ./.env.sample ./.env ; fi
	echo "auto setup is done. now do:"
	echo "- edit server/.env"
	echo "- edit web/.env"

sync: sync-server sync-web sync-root copy-common

start: start-all # build -> serve
build: build-server build-web
serve: serve-all # serve only. does not build.
watch:
		(trap 'kill 0' SIGINT; make watch-web & make watch-server & wait)

docker: copy-common
	@# deferring `docker compose down`. https://qiita.com/KEINOS/items/532dc395fe0f89c2b574
	trap 'docker compose down' EXIT; docker compose up --build

docker-watch: copy-common
	docker compose up --build --watch

seed:
	cd server; bunx prisma db seed

precommit: check-branch lint-staged

lint-staged:
	bunx lint-staged
check-branch:
	@ if [ "$(git branch --show-current)" == "main" ]; then echo "Cannot make commit on main! aborting..."; exit 1; fi

# Sync (install/update packages, generate prisma, etc)

sync-web:
	cd web; bun install
	# copy .env.sample -> .env only if .env is not there

sync-server:
	cd server; bun install
	cd server; bunx prisma generate
	# copy .env.sample -> .env only if .env is not there

sync-root:
	bun install


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
	@ if [ -d web/src/common ]; then rm -r web/src/common; fi
	@ cp -r common web/src/common

