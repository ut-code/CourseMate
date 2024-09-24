import express from "express";
import type { Request, Response } from "express";
import csrf from "../../../src/lib/cross-origin/block-unknown-origin";
import cors from "../../../src/lib/cross-origin/multi-origin-cors";
import methods from "../methods";

const app = express();

const origins = ["http://localhost:3000", "http://localhost:8080"];
const corsConfig = {
  origins,
  methods: methods.map((s) => s.toUpperCase()),
};

app.use(cors(corsConfig));
app.use(csrf(corsConfig));

app.use(express.static("./static"));

for (const kind of methods) {
  const callback = (req: Request, res: Response) => {
    const origin = req.header("Origin");
    if (origin)
      console.log(
        `${kind.toUpperCase()} request from ${origin} reached the server`,
      );
    else
      console.log(
        `${kind.toUpperCase()} request with no Origin header reached the server`,
      );
    res.status(200).send("DATA SENT FROM SERVER");
  };

  app[kind](`/${kind}`, callback);
}

app.listen(3000, () => {
  console.log("CORS test: origin server listening at 3000");
});
