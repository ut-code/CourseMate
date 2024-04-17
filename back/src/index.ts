import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";
import followingRequestRoutes from "./routes/followingRequestRoutes";
import coursesRoutes from "./routes/courses";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import samplesRoutes from "./routes/samples";
import requestsRoutes from "./routes/requests";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.WEB_ORIGIN }));

// ルートハンドラー
app.get("/", (req, res) => {
  res.json("konnnitiha");
});

// ルーティング
app.use("/users", usersRoutes);
// app.use("/followingRequests", followingRequestRoutes);
// app.use("/courses", coursesRoutes);
// app.use("/enrollment", enrollmentRoutes);
// app.use("/requests", requestsRoutes);

// サンプル
// app.use("/samples", samplesRoutes);

// サーバーの起動
app.listen(port, () => {
  console.log("running");
});
