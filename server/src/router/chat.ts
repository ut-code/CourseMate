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
import { areAllMatched, areMatched, findRelation } from "../database/matches";
import type { UserID, InitRoom } from "../common/types";
import { getUserByID } from "../database/users";

const router = express.Router();

router.get("/overview", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");
  const overview = await db.overview(id.value);
  if (!overview.ok) return res.status(500).send();

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

  const rel = await findRelation(user.value, friend.value as UserID);
  if (!rel.ok || rel.value.status !== "MATCHED")
    return res.status(403).send("cannot send DM to non-friend");

  // they are now MATCHED

  const smsg: SendMessage = req.body; // todo: typia
  if (!smsg.content) throw new Error("smsg.content not found"); // zod this
  const msg: Omit<Message, "id"> = {
    creator: user.value,
    createdAt: new Date(),
    edited: false,
    ...smsg,
  };

  const result = await db.sendDM(rel.value.id, msg);
  if (!result.ok) return res.status(500).send();
  res.status(201).send();
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

  const room = await db.findDMbetween(user.value, friend.value);
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

  const init: InitRoom = req.body; // zod

  const allMatched = areAllMatched(user.value, init.members);

  if (!allMatched)
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

  if (!(await db.isUserInRoom(roomId.value as ShareRoomID, user.value)))
    res.status(403).send("you don't belong to that room!");

  const room = await db.findSharedRoom(roomId.value as ShareRoomID);
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

  const name: string = req.body.name; // typia
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

  const invited: UserID[] = req.body; // typia

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

  const old = await db.findMessage(id.value as MessageID);
  if (!old.ok) return res.status(404).send("couldn't find message");
  if (old.value.creator !== user.value)
    return res.status(403).send("cannot edit others' message");

  const content: string = req.body.content; // typia

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
