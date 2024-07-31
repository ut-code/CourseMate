import { PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";
import type {
  RoomOverview,
  DMRoom,
  InitRoom,
  SharedRoom,
  ShareRoomID,
  DMRoomID,
  Message,
  MessageID,
} from "../common/types";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function overview(user: UserID): Promise<RoomOverview[]> {
  const dms = await prisma.dm.findMany({
    where: {
      member: {
        has: user,
      },
    },
  });
  const shared = await prisma.sharedroom.findMany({
    where: {
      member: {
        has: user,
      },
    },
  });
  return shared.concat(dms);
}

// DM Room の作成
export async function createDMRoom({
  creatorId,
  friendId,
}: {
  creatorId: UserID;
  friendId: UserID;
}): Promise<DMRoom> {
  const room: Omit<DMRoom, "isDM"> = await prisma.dm.create({
    data: {
      members: [creatorId, friendId],
      messages: [],
    },
  });
  return {
    isDM: true,
    ...room,
  };
}

/**
 * DM の作成
 * 送信者の id は呼び出す側で指定すること
 **/
export async function sendDM(
  room: DMRoomID,
  content: Omit<Message, "id">,
): Promise<DMRoom> {
  const sentRoom = prisma.dm.update({
    where: {
      id: room,
    },
    data: {
      messages: {
        push: content,
      },
    },
  });

  return sentRoom;
}

export async function createSharedRoom(room: InitRoom) {
  const created = await prisma.sharedroom.create({
    data: {
      name: room.name,
      members: room.members,
      messages: [],
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
  const room: SharedRoom | null = await prisma.sharedroom.findUnique({
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
): Promise<SharedRoom> {
  const updated = await prisma.sharedroom.update({
    where: {
      id: roomId,
    },
    data: {
      name: newName,
    },
  });
  return {
    isDM: false,
    ...updated,
  };
}

export async function inviteUserToSharedRoom(
  roomId: ShareRoomID,
  invite: UserID[],
): Promise<SharedRoom> {
  return await prisma.sharedroom.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        push: invite,
      },
    },
  });
}

export async function findDMof(u1: UserID, u2: UserID): Promise<DMRoom | null> {
  const dm = await prisma.dm.findUnique({
    where: {
      members: [u1, u2],
    },
  });
  return dm;
}

export async function findSharedRoom(roomId: ShareRoomID): Promise<SharedRoom> {
  return await prisma.sharedroom.findUnique({
    where: {
      id: roomId,
    },
  });
}

export async function findMessage(id: MessageID): Promise<Message | null> {
  return await prisma.message.findUnique({
    where: {
      id: id,
    },
  });
}

export async function updateMessage(
  id: MessageID,
  content: string,
): Promise<Message> {
  return await prisma.message.update({
    where: {
      id: id,
    },
    data: {
      content: content,
      edited: true,
    },
  });
}
