import { buildApp } from "./app.js";

const port = process.env.PORT || 4002;
const start = async () => {
  const app = await buildApp();
  app.listen(port, () => console.log(`blockchain-service on :${port}`));
};

start().catch((e) => {
  console.error("Failed to start blockchain-service:", e);
  process.exit(1);
});
