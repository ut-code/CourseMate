default: start

setup: setup-server setup-web setup-root copy-common
	echo "auto setup is done. now do:"
	echo "- run make husky"
	echo "- edit server/.env"
	echo "- edit web/.env"

husky:
	npx husky
	git checkout .husky
	# rm .husky/pre-commit

start: start-all # build -> serve
build: build-server build-web
serve: serve-all # serve only. does not build.
watch:
		(trap 'kill 0' SIGINT; make watch-web & make watch-server & wait)

docker: copy-common
	docker compose up --build

precommit: type-check lint format-check

precommit-check:
	npx prettier . --check
	cd server; npx eslint .


# Setup

setup-web:
	cd web; npm ci
	# copy .env.sample -> .env only if .env is not there
	cd web; if [ ! -f .env ]; then cp ./.env.sample ./.env ; fi

setup-server:
	cd server; npm ci
	cd server; npx prisma generate
	# copy .env.sample -> .env only if .env is not there
	cd server; if [ ! -f .env ]; then cp ./.env.sample ./.env ; fi

setup-root:
	npm ci


# Static checks

## code style
lint:
	cd server; npx eslint .
	cd web; npm run lint

format:
	npx prettier . --write

format-check:
	npx prettier . --check

# type checks
type-check: type-check-server type-check-web

type-check-server: copy-common-to-server
	cd server; npx tsc --noEmit

type-check-web: copy-common-to-web
	cd web; npx tsc --noEmit


# Runner

start-all: build-web build-server
	make serve-all

build-web: copy-common-to-web
	cd web; npm run build
build-server: copy-common-to-server
	cd server; npm run build

# TODO: make SERVE_STATIC flag function
serve-all:
	cp web/dist server/static -r
	cd server; SERVE_STATIC=1 npm run serve

watch-web: copy-common-to-web
	cd web; npm run dev
watch-server: copy-common-to-server
	cd server; npm run dev

copy-common: copy-common-to-server copy-common-to-web
copy-common-to-server:
	if [ -d server/src/common ]; then rm -r server/src/common; fi
	cp -r common server/src/common
copy-common-to-web:
	if [ -d web/src/common ]; then rm -r web/src/common; fi
	cp -r common web/src/common
