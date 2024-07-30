import express from "express";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../common/lib/result/safeParseInt";
import asyncMap from "../lib/async/map";

const router = express.Router();

// TODO: fix this
type DMRoom = {
  members: number[];
};
type InitRoom = {
  members: number[];
};

router.get("/overview", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  // SELECT overview FROM rooms WHERE id IN members

  // SEND: RoomOverview[]
  res.status(200).send('"todo"');
});

// send DM to userid.
router.post("/dm/to/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const friend = safeParseInt(req.params.userid);
  if (!friend.ok) return res.status(400).send("bad param encoding: `dmid`");

  const dm = { messages: ["hi"] }; // SELECT members FROM dms WHERE members = (user, friend)

  type SendMessage = string; // fix this
  const msg: SendMessage = req.body; // todo: typia

  // PUSH msg TO dm
  dm.messages.push(msg);

  // SEND: DMRoom
  res.status(200).send(dm);
});

// GET a DM Room with userid, CREATE one if not found.
router.post("/dm/with/:userid", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const friend = safeParseInt(req.params.userid);
  if (!friend.ok)
    return res.status(400).send("invalid param `userid` fomatting");

  const existingDM = null; // SELECT * FROM DMs WHERE members = (user, friend)
  if (existingDM !== null) return res.status(200).send(existingDM);

  const relation: "PENDING" | "REJECTED" | "MATCHED" = "MATCHED";
  if (relation !== "MATCHED")
    // IF NOT Relationship(user <> friend) = MATCHED
    return res.status(403).send("you and him are not matched yet");

  const room: DMRoom = {
    members: [user.value, friend.value],
  };

  // CREATE room INTO DMs
  return res.status(201).send(room);
});

// create a shared chat room.
router.post(`/shared`, async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const room: DMRoom = {} as DMRoom;

  const rels = await asyncMap(room.members, async (member) => {
    member;
    return "MATCHED"; // GET Relationship<user, member>
  });

  if (rels.some((rel) => rel !== "MATCHED"))
    return res.status(403).send("error: some members are not friends with you");

  // CREATE room IN rooms
  res.status(201).send(room);
});

/** authorized
 * GET -> Get info of a room (including the message log).
 **/
router.get("/shared/:room", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");
  const roomId = safeParseInt(req.params.room);
  if (!roomId.ok) return res.status(400).send("invalid formatting of :room");

  const room = {
    members: [1],
  }; // GET room WHERE room.id = roomId.value

  if (!room.members.includes(user.value))
    res.status(403).send("you don't belong to that room!");

  res.status(200).send(room);
});

/**
 * PATCH -> update room info. (except the message log).
 * - body: UpdateRoom
 **/
router.get("/shared/:room", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const initRoom: InitRoom = req.body; // typia

  const room = initRoom; // CREATE initRoom IN rooms

  res.status(201).send(room);
});

// POST: authorized body=UserID[]
router.post("/shared/id/:room/invite", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const invited: number[] = req.body; // typia

  const rels = await asyncMap(invited, async (invited) => {
    invited;
    return "MATCHED"; // GET Relationship<user, invited>
  });

  if (rels.some((rel) => rel !== "MATCHED")) {
    return res.status(403).send("some of the members are not friends with you");
  }

  // APPEND (...invited) TO room.members

  res.status(204).send();
});

router.patch("/messages/id/:id", async () => {
  // TODO!
  // PATCH: authorized body=SendMessage
  // DELETE: authorized
});

export default router;
