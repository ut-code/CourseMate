import * as express from "express";

const port = 8080;

// shut the fuck up TypeScript
const expressCaller: () => express.Application = (express as any).default as any;
const app = expressCaller();

app.use(express.static("./static"));

app.listen(port, () => {
  console.log(`CORS test: qualified server listening at ${port}`);
});
