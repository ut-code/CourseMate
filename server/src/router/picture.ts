import bodyParser from "body-parser";
import express from "express";
import * as storage from "../database/picture";
import { safeGetGUID } from "../firebase/auth/lib";
import { compressImage } from "../functions/img/compress";

const parseLargeBuffer = bodyParser.raw({
  type: "image/png",
  limit: "5mb",
});
const router = express.Router();

/* General Pictures in chat */

/* Profile Pictures */

router.get("/profile/:guid", async (req, res) => {
  const guid = req.params.guid;
  const result = await storage.get(guid);
  switch (result.ok) {
    case true:
      return res.send(result.value);
    case false:
      return res.status(404).send();
  }
});

router.post("/profile", parseLargeBuffer, async (req, res) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send();

  if (!Buffer.isBuffer(req.body)) return res.status(404).send("not buffer");

  const buf = await compressImage(req.body);
  if (!buf.ok) return res.status(500).send("failed to compress image");

  const url = await storage.set(guid.value, buf.value);
  if (!url.ok) return res.status(500).send("failed to upload image");

  return res.status(201).type("text/plain").send(url.value);
});

export default router;
