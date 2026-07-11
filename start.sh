#!/bin/bash
set -euo pipefail

cleanup() {
  echo "Shutting down..."
  if [ -n "${PYTHON_PID:-}" ]; then
    kill "$PYTHON_PID" 2>/dev/null || true
    wait "$PYTHON_PID" 2>/dev/null || true
  fi
}
trap cleanup SIGTERM SIGINT SIGQUIT

cd ml-api
echo "Starting Python ML API on port 8000..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
PYTHON_PID=$!
cd ..

sleep 2
if ! kill -0 "$PYTHON_PID" 2>/dev/null; then
  echo "ERROR: Python ML API failed to start"
  exit 1
fi
echo "Python ML API started (PID: $PYTHON_PID)"

echo "Starting Node.js frontend on port ${PORT:-10000}..."
exec node .output/server/index.mjs
