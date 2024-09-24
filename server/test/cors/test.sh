#!/usr/bin/env bash
cd `dirname -- $0`

echo "Compiling static/script.ts..."
./compile.sh

(
  trap 'kill 0' EXIT;
  bun ./servers/qualified.ts &
  bun ./servers/unqualified.ts &
  bun ./servers/origin.ts & # or,
  wait
)
