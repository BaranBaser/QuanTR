FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PYTHON_API_URL=http://localhost:8000

# Install Node.js 20
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python dependencies
COPY ml-api/requirements.txt ./ml-api/
RUN pip install --no-cache-dir -r ml-api/requirements.txt

# Node dependencies
COPY package*.json ./
RUN npm install --include=dev

# App source
COPY . .

# Build Node App
RUN npm run build

# Start Script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 10000 8000

CMD ["/start.sh"]
