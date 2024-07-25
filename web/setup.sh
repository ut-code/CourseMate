#!/usr/bin/env sh

cd `dirname -- $0`

npm ci
cp ./.env.sample ./.env
