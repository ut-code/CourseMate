import express from "express";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../common/lib/result/safeParseInt";
import type { UserID, MessageID } from "../common/types";
import { parseUserID } from "../common/zod/methods";
import * as ws from "../lib/socket/socket";
import * as core from "../functions/chat";
import * as db from "../database/chat";
import {
  ContentSchema,
  InitRoomSchema,
  SendMessageSchema,
  SharedRoomSchema,
} from "../common/zod/schemas";

const router = express.Router();

router.get("/overview", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  const result = await core.getOverview(id.value);
  res.status(result.code).send(result.body);
});

// send DM to userid.
router.post("/dm/to/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const friend = safeParseInt(req.params.userid);
  if (!friend.ok) return res.status(400).send("bad param encoding: `userid`");

  const smsg = SendMessageSchema.safeParse(req.body);
  if (!smsg.success) {
    return res.status(400).send("invalid format");
  }

  const result = await core.sendDM(user.value, friend.value, smsg.data);
  if (result.ok) {
    ws.sendMessage(result?.body, friend.value);
  }
  res.status(result.code).send(result.body);
});

// GET a DM Room with userid, CREATE one if not found.
router.get("/dm/with/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const friend = safeParseInt(req.params.userid);
  if (!friend.ok)
    return res.status(400).send("invalid param `userid` fomatting");

  const result = await core.getDM(user.value, friend.value);

  return res.status(result.code).send(result.body);
});

// create a shared chat room.
router.post(`/shared`, async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const init = InitRoomSchema.safeParse(req.body);
  if (!init.success) return res.status(400).send("invalid format");

  const result = await core.createRoom(user.value, init.data);

  return res.status(result.code).send(result.body);
});

router.get("/shared/:roomId", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const roomId = safeParseInt(req.params.roomId);
  if (!roomId.ok) return res.status(400).send("invalid formatting of :roomId");

  const result = await core.getRoom(user.value, roomId.value);
  return res.status(result.code).send(result.body);
});

/**
 * PATCH -> update room info. (except the message log).
 * - body: UpdateRoom
 **/
router.patch("/shared/:room", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const roomId = safeParseInt(req.params.room);
  if (!roomId.ok) return res.status(400).send("invalid :room");

  const room = SharedRoomSchema.safeParse(req.body);
  if (!room.success) return res.status(400).send("invalid format");

  // todo: type check
  const result = await core.patchRoom(user.value, roomId.value, room.data);
  res.status(result.code).send(result.body);
});

// POST: authorized body=UserID[]
router.post("/shared/id/:room/invite", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const roomId = safeParseInt(req.params.room);
  if (!roomId.ok) return res.status(400).send("invalid :room");

  const invited: UserID[] = req.body;
  try {
    if (!Array.isArray(invited)) throw new TypeError();
    invited.map(parseUserID);
  } catch (_) {
    return res.status(400).send("bad formatting");
  }

  const result = await core.inviteUserToRoom(user.value, invited, roomId.value);
  return res.status(result.code).send(result.body);
});

router.patch("/messages/id/:id", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const id = safeParseInt(req.params.id);
  if (!id.ok) return res.status(400).send("invalid :id");
  const friend = req.body.friend;

  const content = ContentSchema.safeParse(req.body.newMessage.content);
  if (!content.success) return res.status(400).send();

  const result = await core.updateMessage(user.value, id.value, content.data);
  res.status(result.code).send(result.body);
  if (result.ok) {
    ws.updateMessage(result.body, friend);
  }
});

router.delete("/messages/id/:id", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const id = safeParseInt(req.params.id);
  if (!id.ok) return res.status(400).send("bad `id` format");
  const friend = req.body.friend;

  await db.deleteMessage(id.value as MessageID, user.value);
  ws.deleteMessage(id.value, friend);
  return res.status(204).send();
});

export default router;
