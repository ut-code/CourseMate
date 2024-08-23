import { PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";
import type {
  User,
  RoomOverview,
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
import { findRelation } from "./matches";
import { searchMatchedUser } from "./requests";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function overview(user: UserID): Promise<RoomOverview[]> {
  const matched: User[] = await searchMatchedUser(user);
  const dmov = matched.map((user) => {
    const ov: DMOverview = {
      isDM: true,
      friendId: user.id,
      name: user.name,
      thumbnail: user.pictureUrl,
    };
    return ov;
  });

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

/**
 * DM の送信
 * 送信者の id は呼び出す側で指定すること
 **/
export async function sendDM(
  relation: RelationshipID,
  content: Omit<Message, "id">,
): Promise<void> {
  await prisma.message.create({
    data: {
      relationId: relation,
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
  if (!rel) return null;

  return findDM(rel.id);
}
export async function findDM(relID: RelationshipID): Promise<DMRoom | null> {
  const messages: Message[] = await prisma.message.findMany({
    where: {
      relationId: relID,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  return {
    isDM: true,
    id: relID,
    messages: messages,
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
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  return {
    id: room.id as ShareRoomID,
    name: room.name,
    isDM: false,
    thumbnail: room.thumbnail,
    members: room.members as UserID[],
    messages: messages,
  };
}

export async function findMessage(id: MessageID): Promise<Message | null> {
  const message = await prisma.message.findUnique({
    where: {
      id: id,
    },
  });
  if (!message) return null;
  return message;
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
  return message;
}

export async function deleteMessage(
  id: MessageID,
  creatorId: UserID | undefined,
): Promise<Message | null> {
  try {
    const message = await prisma.message.delete({
      where: {
        id: id,
        creator: creatorId,
      },
    });
    return message;
  } catch (e) {
    return null;
  }
}
