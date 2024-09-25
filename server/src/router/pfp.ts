import bodyParser from "body-parser";
import express from "express";
import { compressImage } from "../functions/img/compress";

const parseBuffer = bodyParser.raw({ type: "application/octet-stream" });
const router = express.Router();

// which path should I implement?
router.get("/ping/:userId");
router.get("/ping/:picId");
router.get("/:picID");
router.get("/:userId");

router.post("/", parseBuffer, async (req, res) => {
  if (!Buffer.isBuffer(req.body)) return res.status(404).send("not buffer");

  const buf = await compressImage(req.body);
  if (!buf.ok) res.status(500).send();

  // store buf to database or something
  res.status(201).send();
});
