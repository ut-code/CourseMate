import type { Request, Response } from "express";
import { validate, Config } from "./share";

function serverSideBlocking(config: Config) {
  validate(config);
  return function(req: Request, res: Response, next: () => void) {
    const reqOrigin = req.header("Origin");
    if (!reqOrigin) {
      // no origin header == no cors == same origin
      next();
      return
    }
    let ok = false;
    if (config.origins.includes(reqOrigin)) ok = true;
    if (config.origins[0] === "*") ok = true;
    if (ok) {
      // ok: known origin or allowing all origins
      next();
      return
    }
    res.status(403).send("unknown origin header: " + reqOrigin);
  }
}

export default serverSideBlocking;
