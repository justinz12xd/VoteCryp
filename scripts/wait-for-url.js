// Tiny wait-for helper used in docker-compose jobs
const http = require("http");

const url = process.argv[2] || "http://localhost:8545";
const timeoutMs = Number(process.argv[3] || 60000);
const start = Date.now();

function ping(resolve, reject) {
  http
    .get(url, () => resolve())
    .on("error", () => {
      if (Date.now() - start > timeoutMs) return reject(new Error("timeout"));
      setTimeout(() => ping(resolve, reject), 1000);
    });
}

new Promise(ping).then(() => process.exit(0)).catch(() => process.exit(1));
