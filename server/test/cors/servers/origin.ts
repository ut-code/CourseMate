import * as express from "express";
import methods from "../methods"; 
import type { Request, Response } from "express";
import cors from "../../../src/lib/cors/index";

// shut the fuck up TypeScript
const expressCaller: () => express.Application = (express as any).default as any;
const app = expressCaller();

const allowedOrigins = ["http://localhost:3001", "http://localhost:8080"];
const corsConfig = {
  allowedOrigins,
  allowMethods: methods.map(s => s.toUpperCase()),
};

app.use(cors.serverSide(corsConfig));
app.use(cors.clientSide(corsConfig));

methods
  .forEach((kind) => {
    const callback = (req: Request, res: Response) => {
      const origin = req.header("Origin");
      if (origin)
        console.log(`${kind.toUpperCase()} request from ${origin} reached the server`);
      else
        console.log(`${kind.toUpperCase()} request with no Origin header reached the server`);
      res.status(200).send("DATA SENT FROM SERVER");
    };

    app[kind](`/${kind}`, callback);
  });

app.listen(3000, () => {
  console.log("CORS test: origin server listening at 3000");
});

