import express from "express";

const port = 12345; // anything other than 3000 and 8080

const app = express();

app.use(express.static("./static"));

app.listen(port, () => {
  console.log(`CORS test: unqualified server listening at ${port}`);
});
