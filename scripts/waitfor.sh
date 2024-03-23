#!/bin/bash

# The file to be checked
file="$1"

# Maximum wait time in seconds
max_wait=5

# Interval between checks in seconds (multiplied by 10 for integer comparison)
interval=1 # equivalent to 0.1 seconds

# Initialize elapsed time (in tenths of seconds for integer math)
elapsed=0
max_wait=$((max_wait * 10)) # convert max wait to tenths of seconds

while [ $elapsed -lt $max_wait ]; do
  if [ -e "$file" ]; then
    sleep 0.2
    ls -l $file
    exit 0
  fi
  sleep 0.1
  elapsed=$((elapsed + interval))
done

echo "Timed out waiting for file $file to be created."
exit 1
