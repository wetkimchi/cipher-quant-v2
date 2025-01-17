#!/bin/bash

cleanup() {
    # Kill all child processes
    pkill -P $$
    exit
}

# Set up trap to catch SIGTERM and SIGINT
trap cleanup SIGTERM SIGINT

while true; do
    echo "[$(date)] Starting npm process..."
    npm run start &
    NPM_PID=$!
    
    # Wait for the npm process
    wait $NPM_PID
    EXIT_CODE=$?
    
    echo "[$(date)] Process exited with code: $EXIT_CODE"
    
    # Kill any remaining child processes
    pkill -P $$
    
    echo "[$(date)] Restarting in 5 seconds..."
    sleep 5
done
