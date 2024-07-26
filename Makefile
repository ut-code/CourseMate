default: start

setup: setup-server setup-web setup-root
	echo "auto setup is done. now do:"
	echo "- edit server/.env"
	echo "- edit web/.env"

start: start-all # build -> serve
build: build-server build-web
serve: serve-all # serve only. does not build.
watch: watch-server watch-web

docker:
	docker compose up --build

precommit: lint format

precommit-check:
	npx prettier . --check
	cd server; npx eslint .


# Setup

setup-web:
	cd web; npm ci
	cd web; cp ./.env.sample ./.env

setup-server:
	cd server; npm ci
	cd server; npx prisma generate
	cd server; cp ./.env.sample ./.env

setup-root:
	npm ci


# Code style checks

lint:
	cd server; npx eslint .
	cd web; npm lint

format:
	npx prettier . --write


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
