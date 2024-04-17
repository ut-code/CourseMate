import express from "express";
import cors from "cors";
import userRoutes from "./routes/api/userRoutes.js";
import followingRequestRoutes from "./routes/api/followingRequestRoutes.js";
import courseRoutes from "./routes/api/courseRoutes.js";
import enrollmentRoutes from "./routes/api/enrollmentRoutes.js";
import sampleRoutes from "./routes/api/sampleRoutes.js";
import relationshipRoutes from "./routes/api/relationshipRoutes.js";

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
app.use("/api/users", userRoutes);
app.use("/api/followingRequests", followingRequestRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/relationship", relationshipRoutes);

// サンプル
app.use("/api/sample", sampleRoutes);

// サーバーの起動
app.listen(port, () => {
  console.log("running");
});
