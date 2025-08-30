# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || npm install --production
COPY src ./src
COPY openapi.yaml ./openapi.yaml
ENV PORT=4003
EXPOSE 4003
CMD ["node", "src/index.js"]
