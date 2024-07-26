#!/usr/bin/env sh

cd `dirname -- $0`

npm ci
server/setup.sh
# mobile/setup.sh
web/setup.sh

echo "
auto setup is done. now do:
edit server/.env
edit web/.env
"
