import type { Request, Response, RequestHandler } from "express";

/* expected usecase:

const allowedOrigins = [ "localhost:5173" ];
const corsConfig = { allowedOrigins };
const app = express();

app.use(cors.cliendSide(corsConfig));
app.use(cors.serverSide(corsConfig));

*/

type CorsConfig = {
  allowedOrigins: string[];
  allowMethods?: string[];
};

// express middlewares.
// ref: https://expressjs.com/ja/guide/using-middleware.html

function corsPolicy(config: CorsConfig): RequestHandler {
  validate(config);
  const {
    allowedOrigins,
    allowMethods,
  } = config;
  const methods = allowMethods!.join(",");
  return function(req: Request, res: Response, next: () => void) {
    res.header("Access-Control-Max-Age", "86400"); // allow caching this for 1 day
    res.header("Access-Control-Allow-Methods", methods); // allow methods

    if (allowedOrigins.length === 1) {
      res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
    } else {
      // more than 1 allowed origin is given; must determine which one to send
      const reqOrigin = req.header("Origin");
      const origin = allowedOrigins.find((s) => s === reqOrigin);
      if (origin) {
        // allowed origin
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "origin");
      } else {
        // not allowed origin
        res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
        res.header("Vary", "origin");
      }
    }

    next();
  }
}

function serverSideBlocking(config: CorsConfig) {
  validate(config);
  return function(req: Request, res: Response, next: () => void) {
    if (!req.header("Origin")) {
      // no origin header means it's same origin request
      next();
      return
    }
    const reqOrigin = req.header("Origin");
    if (!config.allowedOrigins.some((o) => reqOrigin === o) && config.allowedOrigins[0] !== "*") {
      res.status(403).send("unknown origin header: " + reqOrigin);
      return
    }
    next();
  }
}

// make the cors config valid.
// throws error if unrecoverable.
function validate(config: CorsConfig) {
  // normalize allowOrigin URLs
  config.allowedOrigins = config.allowedOrigins.map(origin => {
    const url = new URL(origin)
    if (url.origin === "null") {
      console.log(`invalid URL: ${origin}. Please prefix this with http:// or https:// if you haven't.`);
      throw "";
    }
    return url.origin
  });

  const defaultAllowedMethods = ["GET", "HEAD", "POST"];
  if (!config.allowMethods) {
    config.allowMethods = defaultAllowedMethods;
  }
  for (const defaultMethod of defaultAllowedMethods) {
    if (!config.allowMethods.some((m => m === defaultMethod))) {
      config.allowMethods.push(defaultMethod);
    }
  }
  assertValidConfig(config);
}

// this throws error if config is not good
function assertValidConfig(config: CorsConfig) {
  if (config.allowedOrigins.length === 0) {
    throw new Error("Empty allowedOrigins in CORS config: " + JSON.stringify(config));
  }
}

export default {
  serverSide: serverSideBlocking,
  clientSide: corsPolicy,
} as {
  serverSide: (c: CorsConfig) => RequestHandler;
  clientSide: (c: CorsConfig) => RequestHandler,
};
