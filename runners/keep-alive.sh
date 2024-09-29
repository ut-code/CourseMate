#!/usr/bin/env zsh

# run for 4 hours
COUNT=$((4 * 60))
INTERVAL=60

repeat $COUNT do
  echo "PINGING ${origins}"
  curl http://localhost:3000 >/dev/null 2>&1 
  sleep $INTERVAL
done
