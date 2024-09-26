import bodyParser from "body-parser";
import express from "express";
import type { UserID } from "../common/types";
import { updateUser } from "../database/users";
import { safeGetUserId } from "../firebase/auth/db";
import { compressImage } from "../functions/img/compress";

// TODO: truncate file at frontend s.t. even the largest file won't trigger the limit
const parseLargeBuffer = bodyParser.raw({
  type: "application/octet-stream",
  limit: "5mb",
});
const router = express.Router();

// TODO: this leaks memory (as it should). make this a permanent storage.
const DATA_STORAGE = new Map<number, Buffer>();

// TODO: fix this
const FILE_URL = (userId: UserID) => `http://localhost:3000/pfp/${userId}`;

// EXPECT PARAM: lastChanged?: JS Date Timestamp as number, save this for caching control
router.get("/:userId", async (req, res) => {
  const userId = Number.parseInt(req.params.userId);
  if (!userId) return res.status(400).send("failed to parse userId");

  // // client side cache control (I don't this it's necessary so I deleted this. fix data types of storage if this is really necessary)
  // const knownUpdate = safeParseInt(String(req.query?.lastChanged));
  // const actual = DATA_STORAGE.get(userId)?.lastUpdate;
  // if (knownUpdate.ok && actual && actual.getTime() === knownUpdate.value) {
  //   return res.status(304).end();
  // }

  const data = DATA_STORAGE.get(userId);
  switch (data) {
    case undefined:
      return res.status(404).send();
    default:
      return res.status(200).send(data);
  }
});

router.post("/", parseLargeBuffer, async (req, res) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send();

  if (!Buffer.isBuffer(req.body)) return res.status(404).send("not buffer");
  const buf = await compressImage(req.body);
  if (!buf.ok) return res.status(500).send();

  DATA_STORAGE.set(userId.value, buf.value);
  const url = FILE_URL(userId.value);

  const result = await updateUser(userId.value, {
    pictureUrl: url,
  });

  console.log(`new URL: ${url}`);
  switch (result.ok) {
    case false:
      return res.status(500).send("failed to save your new url to db");
    case true:
      return res.status(201).send(url);
  }
});

export default router;
