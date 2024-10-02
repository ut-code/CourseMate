#!/usr/bin/env bash

if [ "$PING_ORIGINS" == '' ]; then
  echo 'env variable PING_ORIGINS is required!'
  exit 1
fi
origins=($PING_ORIGINS)
for origin in "${origins[@]}" ; do
  echo "pinging $origin"
  curl http://localhost:3000 >/dev/null 2>&1 
done
