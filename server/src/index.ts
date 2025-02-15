import { error } from "common/lib/panic";
import cookieParser from "cookie-parser";
import express, { type Response } from "express";
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
import "express-async-errors";

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

const corsOptions = {
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

// I don't understand any of those
// https://expressjs.com/en/guide/error-handling.html
// https://qiita.com/nyandora/items/cd4f12eb62295c10269c
// https://note.shiftinc.jp/n/n42b96d36f0cf
// エラーハンドラを Express に管理させる。
// TEMPORARY: will be replaced by hono's `onError`.
app.use(async (err: unknown, _: unknown, res: unknown, next: unknown) => {
  try {
    if (typeof (err as Error)?.cause === "number") {
      (res as Response)
        .status((err as Error).cause as number)
        .send((err as Error).message);
    } else {
      console.error(err);
      (res as Response).status(500).send("Internal Error");
    }
    await (next as () => Promise<unknown>)();
  } catch (err) {
    console.log("[ERR] failed to handle error:", err);
    try {
      (res as Response).status(500).send("Internal error");
    } catch (err) {
      console.log("[ERR] failed to handle error twice:", err);
    }
  } finally {
    try {
      (res as Response).end("\n");
    } catch {}
  }
});

export function main() {
  // サーバーの起動
  const server = app.listen(port, () => {
    console.log("running");
  });
  initializeSocket(server, corsOptions);
  return server;
}
