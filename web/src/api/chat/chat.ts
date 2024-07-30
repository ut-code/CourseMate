import { doWithIdToken, ErrUnauthorized } from "../../firebase/auth/lib";
import endpoints from "../internal/endpoints";

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
};

// TODO: commonify types

/*
- chat (domain)
  - Room (= All chattable places)
    - log
  - DM : part of Room
  - SharedRoom : also part of Room
*/

type PhantomData = never;

export type MessageID = number & {
  __internal_prevent_cast_MessageID: PhantomData;
};
export type ShareRoomID = number & {
  __internal_prevent_cast_RoomID: PhantomData;
};
export type PictureURL = string & {
  __internal_prevent_cast_PictureURL: PhantomData;
};

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
  dmid: DMRoomID;
};

export type ShareRoomOverview = {
  thumbnail: PictureURL;
  lastmsg?: Message;
  isDM: false;
  roomId: ShareRoomID;
};

export type SharedRoom = {
  id: ShareRoomID;
  isDM: false;
  name: string;
  member: User[];
  messages: Message[];
};

export type DMRoomID = number & { __internal_prevent_cast_DMID: PhantomData };
export type DMRoom = {
  id: DMRoomID; // TODO: should this use Relationship.ID or RoomID?
  isDM: true;
  member: User[];
  messages: Message[];
};

export type InitRoom = Omit<Omit<SharedRoom, "id">, "log">;
export type UpdateRoom = {
  name: string;
  pictureUrl: PictureURL;
};

export async function startDM(friendId: UserID): Promise<void> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmrooms, {
      method: "POST",
      body: JSON.stringify({
        with: friendId,
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
): Promise<SharedRoom> {
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

export async function overview(): Promise<RoomOverview[]> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.roomOverview, {
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

export async function getSharedRoom(roomId: ShareRoomID): Promise<SharedRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.sharedRoom(roomId), {
      credentials: "include",
    });
    if (res.status === 404) throw new ErrUnauthorized();
    return await res.json();
  });
}
export async function getDM(dmid: DMRoomID): Promise<DMRoom> {
  return doWithIdToken(async () => {
    const res = await fetch(endpoints.dmroom(dmid), {
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
export async function sendDM(
  dmid: DMRoomID,
  msg: SendMessage,
): Promise<Message> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmroom(dmid), {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(msg),
    });
    return res.json();
  });
}

export async function startDMWith(userId: UserID): Promise<DMRoom> {
  return await doWithIdToken(async () => {
    const res = await fetch(endpoints.dmWith(userId));
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
