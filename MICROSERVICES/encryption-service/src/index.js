import { buildApp } from "./app.js";

const app = buildApp();
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`encryption-service on :${port}`));
