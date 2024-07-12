#!/usr/bin/env sh

cd `dirname -- $0`

cd web
npm ci
cp ./.env.sample ./.env
