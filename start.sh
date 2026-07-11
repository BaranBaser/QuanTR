#!/bin/bash
set -euo pipefail

cleanup() {
  echo "Shutting down..."
  if [ -n "${PYTHON_PID:-}" ]; then
    kill "$PYTHON_PID" 2>/dev/null || true
    wait "$PYTHON_PID" 2>/dev/null || true
  fi
  if [ -n "${NODE_PID:-}" ]; then
    kill "$NODE_PID" 2>/dev/null || true
    wait "$NODE_PID" 2>/dev/null || true
  fi
}
trap cleanup SIGTERM SIGINT SIGQUIT

cd ml-api
echo "Starting Python ML API on port 8000..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
PYTHON_PID=$!
cd ..

echo "Waiting for Python ML API to be ready..."
RETRIES=0
MAX_RETRIES=15
until curl -sf http://localhost:8000/ > /dev/null 2>&1; do
  RETRIES=$((RETRIES + 1))
  if [ "$RETRIES" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Python ML API failed to start after $MAX_RETRIES attempts"
    exit 1
  fi
  sleep 1
done
echo "Python ML API is ready"

echo "Starting Node.js frontend on port ${PORT:-10000}..."
node .output/server/index.mjs &
NODE_PID=$!

wait $NODE_PID
