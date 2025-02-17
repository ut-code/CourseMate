import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { z } from "zod";
import * as chat from "../database/chat";
import * as relation from "../database/matches";
import * as storage from "../database/picture";
import { getUserId } from "../firebase/auth/db";
import { getGUID } from "../firebase/auth/lib";
import { compressImage } from "../functions/img/compress";
import { error } from "../lib/error";
import * as hashing from "../lib/hash";

const largeLimit = bodyLimit({
  maxSize: 50 * 1024, // 50kb
  onError: (c) => {
    return c.text("overflow :(", 413);
  },
});
const router = new Hono();

/* General Pictures in chat */

router.post(
  "/to/:userId",
  zValidator("param", z.object({ userId: z.coerce.number() })),
  largeLimit,
  async (c) => {
    const sender = await getUserId(c);
    const recv = c.req.valid("param").userId;

    const rel = await relation.getRelation(sender, recv);
    if (rel.status !== "MATCHED") error("not matched", 401);

    const buf = new Buffer(await c.req.arrayBuffer());
    const hash = hashing.sha256(buf.toString("base64"));
    const passkey = hashing.sha256(crypto.randomUUID());

    return storage.uploadPic(hash, buf, passkey).then(async (url) => {
      await chat.createImageMessage(sender, rel.id, url);
      return c.text(url);
    });
  },
);

router.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  zValidator("query", z.object({ key: z.string() })),
  async (c) => {
    const hash = c.req.valid("param").id;
    const key = c.req.valid("query").key;
    if (!key) error("key is required", 400);

    return storage.getPic(hash, String(key)).then((buf) => {
      if (buf) {
        c.body(buf);
      } else {
        error("not found", 404);
      }
    });
  },
);

/* Profile Pictures */

router.get(
  "/profile/:guid",
  zValidator("param", z.object({ guid: z.string() })),
  async (c) => {
    const guid = c.req.valid("param").guid;
    const result = await storage.getProf(guid);
    return c.body(result);
  },
);

router.post("/profile", largeLimit, async (c) => {
  const guid = await getGUID(c);
  const buf = await compressImage(new Buffer(await c.req.arrayBuffer()));
  const url = await storage.setProf(guid, buf);

  c.status(201);
  return c.text(url);
});

export default router;
