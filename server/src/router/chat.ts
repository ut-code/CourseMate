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

const router = express.Router();

router.get("/overview", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");
  const overview = await db.getOverview(id.value);
  if (!overview.ok) {
    console.error(overview.error);
    return res.status(500).send();
  }

  // SEND: RoomOverview[].
  // this is NOT ordered. you need to sort it on frontend.
  res.status(200).send(overview.value);
});

// send DM to userid.
router.post("/dm/to/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const friend = safeParseInt(req.params.userid);
  if (!friend.ok) return res.status(400).send("bad param encoding: `userid`");

  const rel = await getRelation(user.value, friend.value as UserID);
  if (!rel.ok || rel.value.status !== "MATCHED")
    return res.status(403).send("cannot send DM to non-friend");

  // they are now MATCHED

  const smsg: SendMessage = req.body; // todo: typia
  try {
    parseSendMessage(smsg);
  } catch (e) {
    return res.status(400).send("invalid format");
  }
  const msg: Omit<Message, "id"> = {
    creator: user.value,
    createdAt: new Date(),
    edited: false,
    ...smsg,
  };

  const result = await db.sendDM(rel.value.id, msg);
  if (!result.ok) return res.status(500).send();
  ws.sendMessage(result.value, friend.value);

  res.status(201).send(result.value);
});

// GET a DM Room with userid, CREATE one if not found.
router.get("/dm/with/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const friend = safeParseInt(req.params.userid);
  if (!friend.ok)
    return res.status(400).send("invalid param `userid` fomatting");

  if (!areMatched(user.value, friend.value as UserID))
    return res.status(403).send("cannot DM with a non-friend");

  const room = await db.getDMbetween(user.value, friend.value);
  if (!room.ok) return res.status(500).send();
  const friendData = await getUserByID(friend.value as UserID);
  if (!friendData.ok) return res.status(404).send("friend not found"); // this should not happen

  const personalized: PersonalizedDMRoom & DMRoom = {
    name: friendData.value.name,
    thumbnail: friendData.value.pictureUrl,
    ...room.value,
  };

  return res.status(201).send(personalized);
});

// create a shared chat room.
router.post(`/shared`, async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const init: InitRoom = req.body;
  try {
    parseInitRoom(init);
  } catch (e) {
    return res.status(400).send("invalid format");
  }

  const allMatched = await areAllMatched(user.value, init.members);
  if (!allMatched.ok) return res.status(500).send("db error");

  if (!allMatched.value)
    return res.status(403).send("error: some members are not friends with you");

  const room = await db.createSharedRoom(init);
  if (!room.ok) return res.status(500).send();

  res.status(201).send(room.value);
});

router.get("/shared/:roomId", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const roomId = safeParseInt(req.params.roomId);
  if (!roomId.ok) return res.status(400).send("invalid formatting of :room");

  const userInRoom = await db.isUserInRoom(
    roomId.value as ShareRoomID,
    user.value,
  );
  if (!userInRoom.ok) return res.status(500).send("db error");
  if (!userInRoom.value)
    return res.status(403).send("you don't belong to that room!");

  const room = await db.getSharedRoom(roomId.value as ShareRoomID);
  if (!room.ok) return res.status(500).send();

  res.status(200).send(room.value);
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
  if (!(await db.isUserInRoom(roomId.value, user.value)))
    return res.status(403).send();

  const name: Name = req.body.name;
  try {
    parseName(name);
  } catch (e) {
    return res.status(400).send("invalid format");
  }
  const room = await db.updateRoomName(roomId.value as ShareRoomID, name);
  if (!room.ok) return res.status(500).send();

  res.status(201).send(room.value);
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
  const friend = req.body.friend;

  const old = await db.getMessage(id.value as MessageID);
  if (!old.ok) return res.status(404).send("couldn't find message");
  if (old.value.creator !== user.value)
    return res.status(403).send("cannot edit others' message");
  const content: string = req.body.newMessage.content;
  try {
    parseContent(content);
  } catch (e) {
    return res.status(400).send("invalid format");
  }

  const msg = await db.updateMessage(id.value as MessageID, content);
  if (!msg.ok) return res.status(500).send();
  ws.updateMessage(msg.value, friend);

  res.status(200).send(msg.value);
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
