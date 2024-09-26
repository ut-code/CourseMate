import bodyParser from "body-parser";
import express from "express";
import { getUserIDByGUID, updateUser } from "../database/users";
import { safeGetUserId } from "../firebase/auth/db";
import { getGUID, safeGetGUID } from "../firebase/auth/lib";
import { uploadImage } from "../firebase/store/uploadImage";
import { compressImage } from "../functions/img/compress";

// TODO: truncate file at frontend s.t. even the largest file won't trigger the limit
const parseLargeBuffer = bodyParser.raw({
  type: "application/octet-stream",
  limit: "5mb",
});
const router = express.Router();

router.post("/", parseLargeBuffer, async (req, res) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send();

  if (!Buffer.isBuffer(req.body)) return res.status(404).send("not buffer");

  const buf = await compressImage(req.body);
  if (!buf.ok) return res.status(500).send("failed to compress image");

  const url = await uploadImage(guid.value, buf.value);
  if (!url.ok) return res.status(500).send("failed to upload image");

  return res.status(201).send(url.value);
});

export default router;
