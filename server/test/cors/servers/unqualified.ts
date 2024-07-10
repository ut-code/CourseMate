import * as express from "express";

const port = 12345; // anything other than 3000 and 8080

// shut the fuck up TypeScript
const expressCaller: () => express.Application = (express as any).default as any;
const app = expressCaller();

app.use(express.static("./static"));

app.listen(port, () => {
  console.log(`CORS test: unqualified server listening at ${port}`);
});
