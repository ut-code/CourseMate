start: watch

setup: setup-server setup-web setup-root
	echo "auto setup is done. now do:"
	echo "- edit server/.env"
	echo "- edit web/.env"

build: build-web build-server

serve: serve-web serve-server

watch: watch-server watch-web

docker:
	docker compose up --build

precommit: lint format

precommit-check:
	npx prettier . --check
	cd server; npx eslint .


	
lint:
	cd server; npx eslint .
	cd web; npm lint

format:
	npx prettier . --write


setup-web:
	cd web; npm ci
	cd web; cp ./.env.sample ./.env

setup-server:
	cd server; npm ci
	cd server; npx prisma generate
	cd server; cp ./.env.sample ./.env

setup-root:
	npm ci

build-web:
	cd web; npm run build

build-server:
	cd server; npm run build

serve-web:
	cd web; npm run serve

serve-server:
	cd server; npm run start

watch-web:
	cd web; npm run dev

watch-server:
	cd server; npm run dev
