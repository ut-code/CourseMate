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
  DMOverview,
  SharedRoomOverview,
} from "../common/types";

const prisma = new PrismaClient();

// ユーザーの参加しているすべての Room の概要 (Overview) の取得
export async function overview(user: UserID): Promise<RoomOverview[]> {
  const dms: DMRoom[] = await prisma.directRoom.findMany({
    where: {
      member: {
        has: user,
      },
    },
  });
  const dmov = dms.map((dm) => {
    const overview: DMOverview = {
      dmid: dm.id,
      name: "TODO: DM 相手のユーザー名をここに",
      thumbnail: "", // TODO: DM 相手のアイコン
      isDM: true,
    };
    return overview;
  });
  const shared: SharedRoom[] = await prisma.sharedRoom.findMany({
    where: {
      member: {
        has: user,
      },
    },
  });
  const sharedov = shared.map((shared) => {
    const overview: SharedRoomOverview = {
      roomId: shared.id,
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
  const room: Omit<DMRoom, "isDM"> = await prisma.directRoom.create({
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
  const sentRoom = prisma.directRoom.update({
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
  const created = await prisma.sharedRoom.create({
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
  const room: SharedRoom | null = await prisma.sharedRoom.findUnique({
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
    ...updated,
  };
}

export async function inviteUserToSharedRoom(
  roomId: ShareRoomID,
  invite: UserID[],
): Promise<SharedRoom> {
  return await prisma.sharedRoom.update({
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
  const dm = await prisma.directRoom.findUnique({
    where: {
      members: [u1, u2],
    },
  });
  return dm;
}

export async function findSharedRoom(roomId: ShareRoomID): Promise<SharedRoom> {
  return await prisma.sharedRoom.findUnique({
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
