import { buildApp } from "./app.js";

const app = buildApp();
const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`blockchain-service on :${port}`));
