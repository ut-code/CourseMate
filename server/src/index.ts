import cookieParser from "cookie-parser";
import express from "express";
import csrf from "./lib/cross-origin/block-unknown-origin";
import cors from "./lib/cross-origin/multi-origin-cors";
import { initializeSocket } from "./lib/socket/socket";
import { allUrlMustBeValid, panic } from "./lib/utils";
import chatRoutes from "./router/chat";
import coursesRoutes from "./router/courses";
import matchesRoutes from "./router/matches";
import pictureRoutes from "./router/picture";
import requestsRoutes from "./router/requests";
import subjectsRoutes from "./router/subjects";
import usersRoutes from "./router/users";

const app = express();

// 高度なクエリパーサーを使わないよう設定。これによりクエリパラメータが配列やオブジェクトではなく string になるようにしている。
// https://expressjs.com/ja/api.html#app.settings.table  の query parser を参照。
app.set("query parser", "simple");

const port = process.env.PORT || 3000;
const allowedOrigins = (
  process.env.CORS_ALLOW_ORIGINS || panic("env CORS_ALLOW_ORIGINS is missing")
)
  .split(",")
  .filter((s) => s); // ignore empty string (trailing comma?)
allUrlMustBeValid(allowedOrigins);

export const corsOptions = {
  origins: allowedOrigins,
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  credentials: true,
};

if (corsOptions.origins.length > 1 && process.env.NODE_ENV === "production") {
  console.warn(
    "WARNING: socket.io only supports one cors origin, therefore only first origin will be registered.",
  );
}

app.use(cors(corsOptions));
app.use(csrf(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.get("/", (_, res) => {
  res.json("Hello from Express!");
});

// ルーティング
app.use("/picture", pictureRoutes);
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
app.use("/subjects", subjectsRoutes);
app.use("/requests", requestsRoutes);
app.use("/matches", matchesRoutes);
app.use("/chat", chatRoutes);

export function main() {
  // サーバーの起動
  const server = app.listen(port, () => {
    console.log("running");
  });
  initializeSocket(server, corsOptions);
  return server;
}
