import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { allUrlMustBeValid, env } from "./lib/utils";
import chatRoutes from "./router/chat";
import coursesRoutes from "./router/courses";
import matchesRoutes from "./router/matches";
import pictureRoutes from "./router/picture";
import requestsRoutes from "./router/requests";
import sseRoutes from "./router/sse";
import subjectsRoutes from "./router/subjects";
import usersRoutes from "./router/users";

const allowedOrigins = env("CORS_ALLOW_ORIGINS")
  .split(",")
  .filter((s) => s);
allUrlMustBeValid(allowedOrigins);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

if (corsOptions.origin.length > 1) {
  console.warn(
    "WARNING: socket.io only supports one cors origin, therefore only first origin will be registered.",
  );
}

const app = new Hono()
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      throw err;
    }
    console.log(err);
    return c.json({ error: err }, 500);
  })

  .use(cors(corsOptions))

  .get("/", async (c) => {
    return c.text("Hello from Hono 🔥");
  })
  // ルーティング
  .route("/picture", pictureRoutes)
  .route("/users", usersRoutes)
  .route("/courses", coursesRoutes)
  .route("/subjects", subjectsRoutes)
  .route("/requests", requestsRoutes)
  .route("/matches", matchesRoutes)
  .route("/chat", chatRoutes)
  .route("/sse", sseRoutes);

export default app;
