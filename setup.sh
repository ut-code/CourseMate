#!/usr/bin/env sh

cd `dirname -- $0`

npm install typescript
(
  cd server
  npm ci
  npx prisma generate
  cp ./.env.sample ./.env
)
# (cd mobile; npm ci) # DO THIS LATER
(
  cd web
  npm ci
  cp ./.env.sample ./.env
)

echo "
auto setup is done. now do:
edit server/.env
edit web/.env
"
