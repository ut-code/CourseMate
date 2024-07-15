import * as express from "express";
import methods from "../methods"; 
import type { Request, Response } from "express";
import cors from "cors";

// shut the fuck up TypeScript
const expressCaller: () => express.Application = (express as any).default as any;
const app = expressCaller();

const allowedOrigins = ["http://localhost:3001", "http://localhost:8080"];
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, flag?: boolean) => void
  ) {
    if (!origin)
      return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.static("./static"));

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
