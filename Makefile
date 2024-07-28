default: start

setup: setup-server setup-web setup-root
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
watch: watch-server watch-web

docker:
	docker compose up --build

precommit: type-check lint format

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
	cd web; npm lint

format:
	npx prettier . --write

# type checks
type-check: type-check-server type-check-web

type-check-server:
	cd server; npx tsc --noEmit

type-check-web:
	cd web; npx tsc --noEmit


# Runner

start-all: build-web build-server
	make serve-all

build-web:
	cd web; npm run build
build-server:
	cd server; npm run build

# TODO: make SERVE_STATIC flag function
serve-all:
	cp web/dist server/static -r
	cd server; SERVE_STATIC=1 npm run serve

watch-web:
	cd web; npm run dev
watch-server:
	cd server; npm run dev
