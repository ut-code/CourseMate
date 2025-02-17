import type { Server } from "node:http";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { initializeSocket } from "./lib/socket/socket";
import { allUrlMustBeValid, env } from "./lib/utils";
import chatRoutes from "./router/chat";
import coursesRoutes from "./router/courses";
import matchesRoutes from "./router/matches";
import pictureRoutes from "./router/picture";
import requestsRoutes from "./router/requests";
import subjectsRoutes from "./router/subjects";
import usersRoutes from "./router/users";

const app = new Hono();

app.onError((err, c) => {
  c.status(500);
  return c.json({ error: err });
});

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

app.use(cors(corsOptions));

app.get("/", async (c) => {
  return c.text("Hello from Hono!");
});

// ルーティング
app.route("/picture", pictureRoutes);
app.route("/users", usersRoutes);
app.route("/courses", coursesRoutes);
app.route("/subjects", subjectsRoutes);
app.route("/requests", requestsRoutes);
app.route("/matches", matchesRoutes);
app.route("/chat", chatRoutes);

export function main() {
  const server = Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT ?? 3000,
  });
  // ??
  initializeSocket(server as unknown as Server, corsOptions);
  return server;
}
export default app;
