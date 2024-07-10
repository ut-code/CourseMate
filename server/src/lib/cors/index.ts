import type { Request, Response, RequestHandler } from "express";

/* expected usecase:

const allowedOrigins = [ "localhost:5173" ];
const corsConfig = { allowedOrigins };
const app = express();

app.use(cors.cliendSide(corsConfig));
app.use(cors.serverSide(corsConfig));

*/

type CorsConfig = {
  origins: string[];
  methods?: string[];
  credentials?: boolean;
};

// express middlewares.
// ref: https://expressjs.com/ja/guide/using-middleware.html

function corsPolicy(config: CorsConfig): RequestHandler {
  validate(config);
  const {
    origins,
    methods,
  } = config;

  const allowMethods = methods!.join(",");
  return function(req: Request, res: Response, next: () => void) {
    // no origin header == no cors == same origin
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

    next();
  }
}

function serverSideBlocking(config: CorsConfig) {
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

// make the cors config valid.
// throws error if unrecoverable.
function validate(config: CorsConfig) {
  config.credentials = !!config.credentials; // make it boolean. not using Boolean() or new Boolean() because I don't trust JS
  
  // normalize allowOrigin URLs
  config.origins= config.origins.map(origin => {
    const url = new URL(origin)
    if (url.origin === "null") {
      console.log(`invalid URL: ${origin}. Please prefix this with http:// or https:// if you haven't.`);
      throw "";
    }
    return url.origin
  });

  const defaultAllowedMethods = ["GET", "HEAD", "POST"];
  if (!config.methods) {
    config.methods= defaultAllowedMethods;
  }
  for (const defaultMethod of defaultAllowedMethods) {
    if (!config.methods.some((m => m === defaultMethod))) {
      config.methods.push(defaultMethod);
    }
  }
  assertValidConfig(config);
}

// this throws error if config is not good
function assertValidConfig(config: CorsConfig) {
  if (config.origins.length === 0) {
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
