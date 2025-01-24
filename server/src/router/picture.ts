import bodyParser from "body-parser";
import { safeParseInt } from "common/lib/result/safeParseInt";
import express from "express";
import * as chat from "../database/chat";
import * as relation from "../database/matches";
import * as storage from "../database/picture";
import { safeGetUserId } from "../firebase/auth/db";
import { safeGetGUID } from "../firebase/auth/lib";
import { compressImage } from "../functions/img/compress";
import * as hashing from "../lib/hash";

const parseLargeBuffer = bodyParser.raw({
  type: "image/png",
  limit: "5mb",
});
const router = express.Router();

/* General Pictures in chat */

router.post("/to/:userId", parseLargeBuffer, async (req, res) => {
  if (!Buffer.isBuffer(req.body)) return res.status(400).send("not buffer");
  const buf = req.body;

  const sender = await safeGetUserId(req);
  if (!sender.ok) return res.status(401).end();
  const recv = safeParseInt(req.params.userId);
  if (!recv.ok) return res.status(400).end();

  const rel = await relation.getRelation(sender.value, recv.value);
  if (!rel.ok) return res.status(401).send();
  if (rel.value.status !== "MATCHED") return res.status(401).send();

  const hash = hashing.sha256(buf.toString("base64"));
  const passkey = hashing.sha256(crypto.randomUUID());

  return storage
    .uploadPic(hash, new Uint8Array(buf), passkey)
    .then(async (url) => {
      await chat.createImageMessage(sender.value, rel.value.id, url);
      res.status(201).send(url).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to upload image to database").end();
    });
});

router.get("/:id", async (req, res) => {
  const hash = req.params.id;
  const key = req.query.key;
  if (!key) return res.status(400).send("key is required");

  return storage
    .getPic(hash, String(key))
    .then((buf) => {
      if (buf) {
        res.status(200).send(buf).end();
      } else {
        res.status(404).send("not found").end();
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Failed to get image from database").end();
    });
});

/* Profile Pictures */

router.get("/profile/:guid", async (req, res) => {
  const guid = req.params.guid;
  const result = await storage.getProf(guid);
  switch (result.ok) {
    case true:
      return res.send(new Buffer(result.value));
    case false:
      return res.status(404).send();
  }
});

router.post("/profile", parseLargeBuffer, async (req, res) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send();

  if (!Buffer.isBuffer(req.body)) return res.status(400).send("not buffer");

  const buf = await compressImage(req.body);
  if (!buf.ok) return res.status(500).send("failed to compress image");

  const url = await storage.setProf(guid.value, new Uint8Array(buf.value));
  if (!url.ok) return res.status(500).send("failed to upload image");

  return res.status(201).type("text/plain").send(url.value);
});

export default router;
