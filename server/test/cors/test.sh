#!/usr/bin/env bash
cd `dirname -- $0`

echo "Compiling static/script.ts..."
./compile.sh

(
  trap 'kill 0' SIGINT;
  npx ts-node ./servers/qualified.ts &
  npx ts-node ./servers/unqualified.ts &
  npx ts-node ./servers/origin.ts # or,
  # npx ts-node ./servers/cors-package.ts
)
