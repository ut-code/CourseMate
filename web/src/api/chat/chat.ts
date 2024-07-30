import { doWithIdToken, ErrUnauthorized } from "../../firebase/auth/lib";

/* TODO
import { UserID } from "../common/types";
import type { User } from "../common/types";
*/

// TODO: import these from common
type UserID = number & { __inmernal_prevent_implicit_cast_UserID: PhantomData };
type GUID = string & { __internal_prevent_implicit_cast_GUID: PhantomData };
type User = {
  id: UserID;
  guid: GUID;
}

// import endpoints from "../internal/endpoints";

// TODO: commonify types

/*
- chat (domain)
  - Room (= All chattable places)
    - log
  - DM : part of Room
  - SharedRoom : also part of Room
*/

type PhantomData = never;

export type MessageID = number & { __internal_prevent_cast_MessageID: PhantomData };
export type ShareRoomID = number & { __internal_prevent_cast_RoomID: PhantomData };
export type PictureURL = string & { __internal_prevent_cast_PictureURL: PhantomData };

export type Message = {
  id: MessageID;
  senderId: UserID;
  content: string;
  createdAt: Date;
};

export type SendMessage = {
  content: string;
};

// the data type to be displayed at initial screen (in list)
export type RoomOverview = ShareRoomOverview | DMOverview;

export type DMOverview = {
  thumbnail: PictureURL;
  lastmsg?: Message;
  isDM: true;
  dmid: DMID;
};

export type ShareRoomOverview = {
  thumbnail: PictureURL;
  lastmsg?: Message;
  isDM: false;
  roomId: ShareRoomID;
};

export type ShareRoom = {
  id: ShareRoomID;
  isDM: false;
  name: string;
  member: User[];
  messages: Message[];
};

export type DMID = number & { __internal_prevent_cast_DMID: PhantomData };
export type DM = {
  id: DMID; // TODO: should this use Relationship.ID or RoomID?
  isDM: true;
  member: User[];
  messages: Message[];
};

export type InitRoom = Omit<Omit<ShareRoom, "id">, "log">;
export type UpdateRoom = {
  name: string;
  pictureUrl: PictureURL;
};

const endpoints = {
  // GET: personalized res.body=RoomOverview[] (also contains DM entries)
  chat: "todo",

  // POST: send a DM authorized body=SendMessage
  DMroom: (dmid: DMID) => "todo" + dmid,

  // POST: authorized body={friend: UserID}
  DMrooms: "todo",

  // POST: authorized
  startDM: (userId: UserID) => "todo" + userId,

  // GET: authorized

  // GET: authorized, PATCH: authorized body=UpdateRoom
  sharedRoom: (roomId: ShareRoomID) => "todo" + roomId,

  // GET: personalized res.body=RoomOverview[], POST: authenticated body=InitRoom
  sharedRooms: "todo",

  // PATCH: authorized body=UserID[]
  roomInvite: (roomId: ShareRoomID) => "invite" + roomId,

  // PATCH: authorized body=SendMessage
  // DELETE: authorized
  message: (messageId: MessageID) => "todo" + messageId,
};

export async function createDM(friendId: UserID): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.DMrooms, {
      method: "POST",
      body: JSON.stringify({
        friend: friendId,
      }),
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `createDM() failed: expected status code 201, got ${res.status}`,
      );
  });
}

export async function createRoom(initRoom: InitRoom): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRooms, {
      method: "POST",
      body: JSON.stringify(initRoom),
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `in createRoom(), expected res status to equal 201, but instead got ${res.status}`,
      );
  });
}

export async function invite(
  roomId: ShareRoomID,
  memberIDs: UserID[],
): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.roomInvite(roomId), {
      method: "PATCH",
      body: JSON.stringify(memberIDs),
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
  });
}

export async function patchRoom(
  roomId: ShareRoomID,
  room: Partial<UpdateRoom>,
): Promise<ShareRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      method: "PATCH",
      body: JSON.stringify(room),
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 200)
      throw new Error(
        `in patchRoom(), expected status code 200 but got ${res.status}`,
      );
    return await res.json();
  });
}

export async function entry(): Promise<RoomOverview[]> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.chat, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    return await res.json();
  });
}

export async function rooms(): Promise<RoomOverview[]> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRooms, {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    return await res.json();
  });
}

export async function getSharedRoom(roomId: ShareRoomID): Promise<ShareRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      credentials: "include",
    });
    if (res.status === 404) throw new ErrUnauthorized();
    return await res.json();
  });
}
export async function getDM(dmid: DMID): Promise<DM> {
  return doWithIdToken(async () => {
    const res = await fetch(endpoints.DMroom(dmid), {
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 200)
      throw new Error(
        `assertion failed on getDM: expected 200 on res.status, but got ${res.status}`,
      );
    return res.json();
  });
}

// don't forget to refresh after sending.
export async function send(
  roomId: ShareRoomID,
  msg: SendMessage,
): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(msg),
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 201)
      throw new Error(
        `on send(), expected status code of 201, but got ${res.status}`,
      );
  });
}

// TODO
export async function sendDM(dmid: DMID, msg: SendMessage): Promise<Message> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.DMroom(dmid), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(msg),
    });
    return res.json();
  });
}

export async function startDMWith(userId: UserID): Promise<DM> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.startDM(userId));
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status === 200 || res.status === 201) return res.json();
    throw new Error(
      `on send(), expected status code of 200 or 201, but got ${res.status}`,
    );
  });
}

export async function deleteMessage(messageId: MessageID): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.message(messageId), {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) throw new ErrUnauthorized();
    if (res.status !== 204)
      throw new Error(
        `on deleteMessage(), expected status code of 204, but got ${res.status}`,
      );
  });
}
