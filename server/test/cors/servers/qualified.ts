import express from "express";

const port = 8080;

const app = express();

app.use(express.static("./static"));

app.listen(port, () => {
  console.log(`CORS test: qualified server listening at ${port}`);
});
