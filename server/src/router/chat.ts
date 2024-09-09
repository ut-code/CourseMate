import express from "express";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../common/lib/result/safeParseInt";
import type {
  Message,
  MessageID,
  SendMessage,
  ShareRoomID,
  PersonalizedDMRoom,
  DMRoom,
} from "../common/types";
import * as db from "../database/chat";
import { areAllMatched, areMatched, getRelation } from "../database/matches";
import type { UserID, InitRoom } from "../common/types";
import { getUserByID } from "../database/users";
import {
  parseContent,
  parseInitRoom,
  parseName,
  parseSendMessage,
  parseUserID,
} from "../common/zod/methods";
import { Name } from "../common/zod/types";
import * as ws from "../lib/socket/socket";
import * as core from "../functions/chat";
import { InitRoomSchema, SendMessageSchema, SharedRoomSchema } from "../common/zod/schemas";

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
  if (!init.success)
    return res.status(400).send("invalid format");

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
    invited.map(parseUserID);
  } catch (e) {
    return res.status(400).send("invalid format");
  }

  if (!(await areAllMatched(user.value, invited)))
    return res.status(403).send("some of the members are not friends with you");

  const room = await db.inviteUserToSharedRoom(
    roomId.value as ShareRoomID,
    invited,
  );
  if (!room.ok) return res.status(500).send();

  res.status(200).send(room.value);
});

router.patch("/messages/id/:id", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const id = safeParseInt(req.params.id);
  if (!id.ok) return res.status(400).send("invalid :id");

  const old = await db.getMessage(id.value as MessageID);
  if (!old.ok) return res.status(404).send("couldn't find message");
  if (old.value.creator !== user.value)
    return res.status(403).send("cannot edit others' message");

  const content: string = req.body.content;
  try {
    parseContent(content);
  } catch (e) {
    return res.status(400).send("invalid format");
  }

  const msg = await db.updateMessage(id.value as MessageID, content);
  if (!msg.ok) return res.status(500).send();

  res.status(200).send(msg.value);
});

router.delete("/messages/id/:id", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  // DELETE: authorized TODO!
});

export default router;
