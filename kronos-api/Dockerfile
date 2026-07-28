FROM python:3.10-slim

WORKDIR /app

# Install git for cloning the Kronos model code
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

# Clone the Kronos model source (needed for model/kronos.py classes)
RUN git clone --depth 1 https://github.com/shiyu-coder/Kronos.git /app/kronos_repo

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY app.py .

# Expose port 7860 (HF Spaces default)
EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
