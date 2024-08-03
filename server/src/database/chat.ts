import { PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";
import type {
  User,
  RoomOverview,
  Relationship,
  RelationshipID,
  DMRoom,
  InitRoom,
  SharedRoom,
  ShareRoomID,
  Message,
  MessageID,
  DMOverview,
  SharedRoomOverview,
} from "../common/types";
import { findRelation, findRelations } from "./matches";
import { getUserByID } from "./users";
import asyncMap from "../lib/async/map";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function overview(user: UserID): Promise<RoomOverview[]> {
  const rels: Relationship[] = await findRelations(user);
  const dmov = (
    await asyncMap(rels, async (rel) => {
      let friend: User | null = null;
      if (rel.sendingUserId === user) {
        friend = await getUserByID(rel.receivingUserId);
      } else {
        friend = await getUserByID(rel.sendingUserId);
      }
      if (!friend) return null;
      const overview: DMOverview = {
        friendId: friend.id as UserID,
        name: friend.name,
        thumbnail: friend.pictureUrl,
        isDM: true,
      };
      return overview;
    })
  ).filter((ov) => ov !== null);

  const shared: {
    id: number;
    name: string;
    thumbnail: string;
  }[] = await prisma.sharedRoom.findMany({
    where: {
      members: {
        has: user,
      },
    },
  });
  const sharedov = shared.map((shared) => {
    const overview: SharedRoomOverview = {
      roomId: shared.id as ShareRoomID,
      name: shared.name,
      thumbnail: shared.thumbnail,
      isDM: false,
    };
    return overview;
  });

  return [...sharedov, ...dmov];
}

// DM Room の作成
export async function createDMRoom({
  creatorId,
  friendId,
}: {
  creatorId: UserID;
  friendId: UserID;
}): Promise<DMRoom> {
  const relID = await findRelation(creatorId, friendId);
  if (!relID) throw new Error("rel not found!");
  const room = await prisma.directRoom.create({
    data: {
      id: relID.id,
    },
  });
  return {
    isDM: true,
    messages: [],
    id: room.id as RelationshipID,
  };
}

/**
 * DM の送信
 * 送信者の id は呼び出す側で指定すること
 **/
export async function sendDM(
  roomId: RelationshipID,
  content: Omit<Message, "id">,
): Promise<void> {
  await prisma.message.create({
    data: {
      directRoomId: roomId,
      ...content,
    },
  });
}

export async function createSharedRoom(room: InitRoom) {
  const created = await prisma.sharedRoom.create({
    data: {
      thumbnail: "todo",
      name: room.name,
      members: room.members,
    },
  });
  return {
    isDM: false,
    ...created,
  };
}

export async function isUserInRoom(
  roomId: ShareRoomID,
  userId: UserID,
): Promise<boolean> {
  const room = await prisma.sharedRoom.findUnique({
    where: {
      id: roomId,
      members: {
        has: userId,
      },
    },
  });

  return room !== null;
}

export async function updateRoomName(
  roomId: ShareRoomID,
  newName: string,
): Promise<Omit<SharedRoom, "messages">> {
  const updated = await prisma.sharedRoom.update({
    where: {
      id: roomId,
    },
    data: {
      name: newName,
    },
  });
  return {
    isDM: false,
    id: updated.id as ShareRoomID,
    name: updated.name,
    thumbnail: updated.thumbnail,
    members: updated.members as UserID[],
  };
}

export async function inviteUserToSharedRoom(
  roomId: ShareRoomID,
  invite: UserID[],
): Promise<Omit<SharedRoom, "messages">> {
  const update = await prisma.sharedRoom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        push: invite,
      },
    },
  });
  return {
    isDM: false,
    ...update,
  } as Omit<SharedRoom, "messages">;
}

export async function findDMbetween(
  u1: UserID,
  u2: UserID,
): Promise<DMRoom | null> {
  const rel = await findRelation(u1, u2);
  if (!rel) return null; // no request = no match = no dm

  const messages: Message[] = await prisma.message.findMany({
    where: {
      directRoomId: rel.id,
    },
  });

  return {
    isDM: true,
    id: rel.id,
    messages: messages.map((m) => {
      // I know it's bad. find a better way and fix it.
      return {
        id: m.id as MessageID,
        creator: m.creator as UserID,
        createdAt: m.createdAt,
        content: m.content,
        edited: m.edited,
      };
    }),
  };
}

export async function findSharedRoom(
  roomId: ShareRoomID,
): Promise<SharedRoom | null> {
  const room = await prisma.sharedRoom.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) return null;

  const messages = await prisma.message.findMany({
    where: {
      sharedRoomId: room.id,
    },
  });
  return {
    id: room.id as ShareRoomID,
    name: room.name,
    isDM: false,
    thumbnail: room.thumbnail,
    members: room.members as UserID[],
    messages: messages.map(castMessage),
  };
}

export async function findMessage(id: MessageID): Promise<Message | null> {
  const message = await prisma.message.findUnique({
    where: {
      id: id,
    },
  });
  if (!message) return null;
  return castMessage(message);
}

export async function updateMessage(
  id: MessageID,
  content: string,
): Promise<Message> {
  const message = await prisma.message.update({
    where: {
      id: id,
    },
    data: {
      content: content,
      edited: true,
    },
  });
  return castMessage(message);
}

function castMessage(m: {
  id: number;
  creator: number;
  createdAt: Date;
  content: string;
  edited: boolean;
}) {
  return {
    id: m.id as MessageID,
    creator: m.creator as UserID,
    createdAt: m.createdAt,
    content: m.content,
    edited: m.edited,
  };
}
