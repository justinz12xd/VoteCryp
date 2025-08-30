# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || npm install --production
COPY src ./src
COPY swagger.yaml ./swagger.yaml
ENV PORT=4002
EXPOSE 4002
CMD ["node", "src/index.js"]
