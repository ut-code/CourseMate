import type { Request, Response } from "express";
import { validate, Config } from "./share";

function serverSideBlocking(config: Config) {
  validate(config);
  return function(req: Request, res: Response, next: () => void) {
    if (!req.header("Origin")) {
      // no origin header == no cors == same origin
      next();
      return
    }
    const reqOrigin = req.header("Origin");
    if (!config.origins.some((o) => reqOrigin === o) && config.origins[0] !== "*") {
      res.status(403).send("unknown origin header: " + reqOrigin);
      return
    }
    next();
  }
}

export default serverSideBlocking;
