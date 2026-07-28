FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN NODE_OPTIONS='--max-old-space-size=400' npm run build

FROM node:20-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 10000
CMD ["node", ".output/server/index.mjs"]
