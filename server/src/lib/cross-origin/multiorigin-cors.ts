import { validateConfig, type Config } from "./share";
import cors from "cors";

/* expected usecase:

const origins = [ "localhost:3000", "localhost:5173" ];
const corsConfig = { origins };
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

export default (config: Config) => {
  validateConfig(config);

  function origin(
    origin: string | undefined,
    callback: (error: Error | null, flag?: boolean) => void,
  ) {
    // origin not found === same origin request (or non-browser request)
    if (!origin) {
      return callback(null, true);
    }

    // origin in allowedOrigins. good.
    if (config.origins.includes(origin)) {
      return callback(null, true);
    }

    // origin exists and not in allowedOrigins. bad.
    return callback(new Error("Not allowed by CORS"));
  }

  return cors({ origin: origin });
};
