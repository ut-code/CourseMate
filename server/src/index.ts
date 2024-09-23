import * as dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import nocsrf from "./lib/cross-origin/block-unknown-origin";
import cors from "./lib/cross-origin/multiorigin-cors";
import { initializeSocket } from "./lib/socket/socket";
import chatRoutes from "./router/chat";
import coursesRoutes from "./router/courses";
import matchesRoutes from "./router/matches";
import requestsRoutes from "./router/requests";
import usersRoutes from "./router/users";

const app = express();

// 高度なクエリパーサーを使わないよう設定。これによりクエリパラメータが配列やオブジェクトではなく string になるようにしている。
// https://expressjs.com/ja/api.html#app.settings.table  の query parser を参照。
app.set("query parser", "simple");

const port = 3000;
const allowedOrigins = [
  process.env.SERVER_ORIGIN ?? "http://localhost:3000", // delete this fallback when you think everyone has updated their .env
  process.env.WEB_ORIGIN,
  process.env.MOBILE_ORIGIN,
  process.env.WEB_ORIGIN_BUILD,
];
export const corsOptions = {
  origins: allowedOrigins.map((s) => s || "").filter((s) => s !== ""),
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(nocsrf(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json("Hello from Express!");
});

// ルーティング
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
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

if (__filename === require.main?.filename) {
  main();
}
