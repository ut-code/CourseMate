import type { Request, Response, RequestHandler } from "express";
import { validate } from "./share";
import type { Config } from "./share";

/* expected usecase:

const allowedOrigins = [ "localhost:5173" ];
const corsConfig = { allowedOrigins };
const app = express();

app.use(cors.cliendSide(corsConfig));
app.use(cors.serverSide(corsConfig));

*/

// express middlewares.
// ref: https://expressjs.com/ja/guide/using-middleware.html

// CORS is a method to bypass client-side SOP.
// NOTE: even if CORS is enabled, the server is still vulnerable to CSRF attacks.
// use the serverSideBlocking() below for CSRF.
// more about CORS:
// - https://developer.mozilla.org/ja/docs/Web/HTTP/CORS
function corsPolicy(config: Config): RequestHandler {
  validate(config);
  const {
    origins,
    methods,
  } = config;

  const allowMethods = methods!.join(",");
  return function(req: Request, res: Response, next: () => void) {
    // no origin header == no cors == same origin
    // even if it's same origin, it will send Origin header when the method is not a 'safe' method.
    // so it's good to skip when no Origin header is found.
    if (!req.header("Origin")) {
      next();
      return
    }
    res.header("Access-Control-Max-Age", "86400"); // allow caching this for 1 day
    res.header("Access-Control-Allow-Methods", allowMethods); // allow methods
    if (config.credentials)
      res.header("Access-Control-Allow-Credentials", "true"); // allow credentials

    if (origins.length === 1) {
      res.header("Access-Control-Allow-Origin", origins[0]);
    } else {
      // more than 1 allowed origin is given; must determine which one to send
      const reqOrigin = req.header("Origin");
      const origin = origins.find((s) => s === reqOrigin);
      if (origin) {
        // allowed origin
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "origin");
      } else {
        // not allowed origin
        res.header("Access-Control-Allow-Origin", origins[0]);
        res.header("Vary", "origin");
      }
    }

    if (req.method === "OPTIONS") {
      res.status(204).send();
      return
    }

    next();
  }
}


export default corsPolicy;
