import type { UserID } from "common/types";
import type {
  DMOverview,
  DMRoom,
  InitRoom,
  Message,
  MessageID,
  RelationshipID,
  RoomOverview,
  ShareRoomID,
  SharedRoom,
  SharedRoomOverview,
} from "common/types";
import { prisma } from "./client";
import { getRelation } from "./matches";
import {
  getMatchedUser,
  getPendingRequestsFromUser,
  getPendingRequestsToUser,
} from "./requests";
import { getUserByID } from "./users";

export async function getOverview(user: UserID): Promise<RoomOverview[]> {
  const matched = await getMatchedUser(user);
  const senders = await getPendingRequestsToUser(user);
  const receivers = await getPendingRequestsFromUser(user);

  //マッチングしている人のオーバービュー
  const matchingOverview = await Promise.all(
    matched.map(async (m) => getOverviewBetween(user, m.id)),
  );

  //自分にリクエストを送ってきた人のオーバービュー
  const senderOverview = await Promise.all(
    senders.map((s) => getOverviewBetween(user, s.id)),
  );

  //自分がリクエストを送った人のオーバービュー
  const receiverOverview = await Promise.all(
    receivers.map((r) => getOverviewBetween(user, r.id)),
  );

  const sharedRooms: {
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
  const shared = sharedRooms.map((room) => {
    const overview: SharedRoomOverview = {
      roomId: room.id as ShareRoomID,
      name: room.name,
      thumbnail: room.thumbnail,
      isDM: false,
    };
    return overview;
  });

  const overview = [
    ...matchingOverview,
    ...senderOverview,
    ...receiverOverview,
    ...shared,
  ];

  const sortedOverviewByTime = overview.sort((a, b) => {
    const dateA = a.lastMsg?.createdAt ? a.lastMsg.createdAt.getTime() : 0;
    const dateB = b.lastMsg?.createdAt ? b.lastMsg.createdAt.getTime() : 0;
    return dateB - dateA;
  });

  return [...sortedOverviewByTime];
}

async function getOverviewBetween(
  user: number,
  other: number,
): Promise<DMOverview> {
  const rel = await getRelation(user, other);

  const friendId =
    rel.receivingUserId === user ? rel.sendingUserId : rel.receivingUserId;
  const lastMessage = getLastMessage(user, friendId);
  const unreadCount = unreadMessages(user, rel.id);
  const friend = await getUserByID(friendId);
  const overview: DMOverview = {
    isDM: true,
    matchingStatus: "matched",
    friendId: friendId,
    name: friend.name,
    thumbnail: friend.pictureUrl,
    lastMsg: await lastMessage,
    unreadMessages: await unreadCount,
  };
  return overview;
}
export async function markAsRead(
  rel: RelationshipID,
  reader: UserID,
  message: MessageID,
) {
  return await prisma.message.updateMany({
    where: {
      id: {
        lte: message,
      },
      relationId: rel,
      creator: {
        not: {
          equals: reader,
        },
      },
    },
    data: {
      read: true,
    },
  });
}

/**
 * DM の送信
 * 送信者の id は呼び出す側で指定すること
 **/
export async function sendDM(
  relation: RelationshipID,
  content: Omit<Omit<Message, "id">, "isPicture">,
): Promise<Message> {
  const message = await prisma.message.create({
    data: {
      // isPicture: false, // todo: bring it back
      relationId: relation,
      isPicture: false,
      read: false,
      ...content,
    },
  });
  return message;
}
/**
this doesn't create the image. use uploadPic in database/picture.ts to create the image.
**/
export async function createImageMessage(
  sender: UserID,
  relation: RelationshipID,
  url: string,
) {
  return prisma.message.create({
    data: {
      creator: sender,
      relationId: relation,
      content: url,
      isPicture: true,
    },
  });
}

export async function createSharedRoom(room: InitRoom): Promise<SharedRoom> {
  type CreateRoom = Omit<Omit<SharedRoom, "isDM">, "messages">;
  const created: CreateRoom = await prisma.sharedRoom.create({
    data: {
      thumbnail: "todo",
      name: room.name,
      members: room.members,
    },
  });
  return {
    isDM: false,
    messages: [],
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

export async function updateRoom(
  roomId: ShareRoomID,
  newRoom: Partial<Omit<SharedRoom, "messages">>,
): Promise<Omit<SharedRoom, "messages">> {
  type UpdatedRoom = Omit<Omit<SharedRoom, "isDM">, "messages">;
  const updated: UpdatedRoom = await prisma.sharedRoom.update({
    where: {
      id: roomId,
    },
    data: newRoom,
  });
  return {
    isDM: false,
    ...updated,
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
  };
}

export async function getDMbetween(u1: UserID, u2: UserID): Promise<DMRoom> {
  const rel = await getRelation(u1, u2);
  return await findDM(rel.id);
}

export async function findDM(relID: RelationshipID): Promise<DMRoom> {
  const messages: Message[] = await prisma.message.findMany({
    where: {
      relationId: relID,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    isDM: true,
    id: relID,
    messages: messages,
  };
}

export async function getSharedRoom(roomId: ShareRoomID): Promise<SharedRoom> {
  const room = await prisma.sharedRoom.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) throw new Error("room not found");

  const messages = await prisma.message.findMany({
    where: {
      sharedRoomId: room.id,
    },
  });
  return {
    isDM: false,
    messages: messages,
    ...room,
  };
}

export async function getMessage(id: MessageID): Promise<Message> {
  const message = await prisma.message.findUnique({
    where: {
      id: id,
    },
  });
  if (!message) throw new Error("not found");
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
  const message = await prisma.message.delete({
    where: {
      id: id,
      creator: creatorId,
    },
  });
  return message;
}

export async function getLastMessage(
  userId: UserID,
  friendId: UserID,
): Promise<Message> {
  const rel = await getRelation(userId, friendId);
  if (!rel) throw new Error("relation not found"); // relation not found
  const lastMessage = await prisma.message.findFirst({
    where: {
      relationId: rel.id,
    },
    orderBy: {
      id: "desc",
    },
    take: 1,
  });
  if (!lastMessage) throw new Error("last message not found");
  return lastMessage;
}

// only works on Relationship (= DM) for now.
export async function unreadMessages(userId: UserID, roomId: RelationshipID) {
  // FIXME: this makes request twice to the database. it's not efficient.
  const unreadMessages = await prisma.message.count({
    where: {
      read: false,
      relationId: roomId,
      creator: {
        not: {
          equals: userId,
        },
      },
    },
  });
  return unreadMessages;
}
