FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PYTHON_API_URL=http://localhost:8000

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3.10 \
    python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python dependencies
COPY ml-api/requirements.txt ./ml-api/
RUN pip3 install --no-cache-dir -r ml-api/requirements.txt

# Node dependencies
COPY package*.json ./
RUN npm install

# App source
COPY . .

# Build Node App
RUN npm run build

# Start Script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
