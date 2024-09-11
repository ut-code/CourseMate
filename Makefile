default: start

setup: setup-server setup-web setup-root copy-common
	npx husky
	echo "auto setup is done. now do:"
	echo "- run make husky"
	echo "- edit server/.env"
	echo "- edit web/.env"

start: start-all # build -> serve
build: build-server build-web
serve: serve-all # serve only. does not build.
watch: setup
		(trap 'kill 0' SIGINT; make watch-web & make watch-server & wait)

docker: copy-common
	@# defer `docker compose down`. https://qiita.com/KEINOS/items/532dc395fe0f89c2b574
	trap 'docker compose down' EXIT; docker compose up --build
	docker compose up --build
docker-watch: copy-common
	docker compose up --build --watch

precommit: type-check
	npx lint-staged

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
	cd web; npx eslint --ext ts,tsx .

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

serve-all:
	(trap 'kill 0' EXIT; make serve-web & make serve-server & wait)
serve-web:
	cd web; npm run preview # todo: make serve function
serve-server:
	cd server; npm run serve

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
