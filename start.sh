#!/bin/bash
# Start FastAPI backend in the background
cd ml-api
# Uvicorn will listen on 8000
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
cd ..

# Start Node frontend in the foreground
# Render automatically injects the $PORT environment variable (default 10000)
# Nitro automatically listens on $PORT
node .output/server/index.mjs
