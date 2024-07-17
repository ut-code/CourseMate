#!/usr/bin/env sh

cd `dirname -- $0`

npm ci
npx prisma generate
cp ./.env.sample ./.env
