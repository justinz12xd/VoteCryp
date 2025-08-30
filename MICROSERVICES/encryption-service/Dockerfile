# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || npm install --production
COPY src ./src
COPY openapi.yaml ./openapi.yaml
ENV PORT=4001
EXPOSE 4001
CMD ["node", "src/index.js"]
