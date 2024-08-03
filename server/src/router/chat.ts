import express from "express";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../common/lib/result/safeParseInt";
import type {
  Message,
  MessageID,
  SendMessage,
  ShareRoomID,
  PersonalizedDMRoom,
} from "../common/types";
import asyncMap from "../lib/async/map";
import * as db from "../database/chat";
import { areAllMatched, areMatched } from "../database/matches";
import type { UserID, InitRoom } from "../common/types";
import { lazyFallbackAsync } from "../common/lib/fallback";
import { getUserByID } from "../database/users";

const router = express.Router();

router.get("/overview", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");
  const overview = await db.overview(id.value);

  // SELECT overview FROM rooms WHERE id IN members

  // SEND: RoomOverview[].
  // this is NOT ordered. you need to sort it on frontend.
  res.status(200).send(overview);
});

// send DM to userid.
router.post("/dm/to/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const friend = safeParseInt(req.params.userid);
  if (!friend.ok) return res.status(400).send("bad param encoding: `dmid`");

  if (!areMatched(user.value, friend.value as UserID))
    return res.status(403).send("cannot send DM to non-friend");

  // they are now MATCHED

  const smsg: SendMessage = req.body; // todo: typia
  const msg: Omit<Message, "id"> = {
    creator: user.value,
    createdAt: new Date(),
    edited: false,
    ...smsg,
  };

  const room = await lazyFallbackAsync(
    await db.findDMbetween(user.value, friend.value as UserID),
    async () => {
      return await db.createDMRoom({
        creatorId: user.value,
        friendId: friend.value as UserID,
      });
    },
  );

  const newRoom = db.sendDM(room.id, msg);

  // SEND: DMRoom
  res.status(200).send(newRoom);
});

// GET a DM Room with userid, CREATE one if not found.
router.put("/dm/with/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const friend = safeParseInt(req.params.userid);
  if (!friend.ok)
    return res.status(400).send("invalid param `userid` fomatting");

  const existingDM = null; // SELECT * FROM DMs WHERE members = (user, friend)
  if (existingDM !== null) return res.status(200).send(existingDM);

  if (!areMatched(user.value, friend.value as UserID))
    return res.status(403).send("cannot DM with a non-friend");

  const room = await db.createDMRoom({
    creatorId: user.value,
    friendId: friend.value as UserID,
  });

  const friendData = await getUserByID(friend.value as UserID);

  const personalized: PersonalizedDMRoom = {
    name: friendData!.name,
    thumbnail: friendData!.pictureUrl,
    ...room,
  };

  return res.status(201).send(personalized);
});

// create a shared chat room.
router.post(`/shared`, async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const init: InitRoom = req.body;

  const allMatched = (
    await asyncMap(init.members, async (member) => {
      return await areMatched(user.value, member);
    })
  ).reduce((a, b) => a && b);

  if (!allMatched)
    return res.status(403).send("error: some members are not friends with you");

  const room = db.createSharedRoom(init);

  res.status(201).send(room);
});

router.get("/shared/:roomId", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const roomId = safeParseInt(req.params.roomId);
  if (!roomId.ok) return res.status(400).send("invalid formatting of :room");

  if (!(await db.isUserInRoom(roomId.value as ShareRoomID, user.value)))
    res.status(403).send("you don't belong to that room!");

  const room = db.findSharedRoom(roomId.value as ShareRoomID);

  res.status(200).send(room);
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

  const name: string = req.body.name; // typia
  const room = db.updateRoomName(roomId.value as ShareRoomID, name);

  res.status(201).send(room);
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

  const room = db.inviteUserToSharedRoom(roomId.value as ShareRoomID, invited);

  res.status(200).send(room);
});

router.patch("/messages/id/:id", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const id = safeParseInt(req.params.id);
  if (!id.ok) return res.status(400).send("invalid :id");

  const old = await db.findMessage(id.value as MessageID);
  if (!old) return res.status(404).send("couldn't find message");
  if (old.creator !== user.value)
    return res.status(403).send("cannot edit others' message");

  const content: string = req.body.content; // typia

  const msg = await db.updateMessage(id.value as MessageID, content);
  res.status(200).send(msg);
});

// DELETE: authorized TODO!
router.delete("/messages/id/:id", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
});

export default router;
