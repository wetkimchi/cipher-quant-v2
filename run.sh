#!/bin/bash

while true; do
    echo "[$(date)] Starting npm process..."
    npm run start
    
    EXIT_CODE=$?
    echo "[$(date)] Process exited with code: $EXIT_CODE"
    
    echo "[$(date)] Restarting in 5 seconds..."
    sleep 5
done
