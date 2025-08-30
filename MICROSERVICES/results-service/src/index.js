import { buildApp } from "./app.js";

const app = buildApp();
const port = process.env.PORT || 4003;
app.listen(port, () => console.log(`results-service on :${port}`));
