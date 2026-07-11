FROM python:3.11-slim AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PYTHON_API_URL=http://localhost:8000

RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /sbin/nologin appuser

WORKDIR /app

COPY ml-api/requirements.txt ./ml-api/
RUN pip install --no-cache-dir -r ml-api/requirements.txt

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.output ./.output
COPY start.sh ./
RUN chmod +x start.sh

RUN chown -R appuser:appuser /app

EXPOSE 10000 8000

USER appuser

CMD ["bash", "start.sh"]
