import { PrismaClient } from "@prisma/client";
import { User, UserID, Relationship } from "../common/types";

const prisma = new PrismaClient();

// マッチリクエストの送信
export async function sendRequest({
  senderId,
  receiverId,
}: {
  senderId: UserID;
  receiverId: UserID;
}): Promise<Relationship> {
  // 既存の関係をチェック
  const existingRelationship = await prisma.relationship.findFirst({
    where: {
      OR: [
        { sendingUserId: senderId, receivingUserId: receiverId },
        { sendingUserId: receiverId, receivingUserId: senderId }, // 逆の関係もチェック
      ],
    },
  });
  // 既存の関係がある場合はそのまま返す
  if (existingRelationship) {
    return existingRelationship;
  }
  // 既存の関係がない場合は新しい関係を作成
  const newRelationship = await prisma.relationship.create({
    data: {
      sendingUser: { connect: { id: senderId } },
      receivingUser: { connect: { id: receiverId } },
      status: "PENDING",
    },
  });
  return newRelationship;
}

// 特定のユーザが送信・受信したマッチリクエストの取得
// TODO: make is less generic s.t. it is safer to use and easier to maintain
export async function getRequestsByUserId({
  senderId,
  receiverId,
}: {
  senderId?: UserID;
  receiverId?: UserID;
}): Promise<Relationship[]> {
  if (senderId === undefined && receiverId === undefined) {
    throw new Error("Either senderId or receiverId must be provided");
  }
  const whereClause: { sendingUserId?: UserID; receivingUserId?: UserID } = {};
  if (senderId !== undefined) {
    whereClause.sendingUserId = senderId;
  }
  if (receiverId !== undefined) {
    whereClause.receivingUserId = receiverId;
  }
  const found = await prisma.relationship.findMany({
    where: whereClause,
  });
  return found;
}

// マッチリクエストの承認
export async function approveRequest(
  senderId: UserID,
  receiverId: UserID,
): Promise<Relationship> {
  const updated = await prisma.relationship.update({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: senderId,
        receivingUserId: receiverId,
      },
    },
    data: {
      status: "MATCHED",
    },
  });
  return updated;
}

// マッチリクエストの拒否
export async function rejectRequest(
  senderId: UserID,
  receiverId: UserID,
): Promise<Relationship> {
  return await prisma.relationship.update({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: senderId,
        receivingUserId: receiverId,
      },
    },
    data: {
      status: "REJECTED",
    },
  });
}

//ユーザーへのリクエストを探す 俺をリクエストしているのは誰だ
export async function findPendingRequestsToUser(
  userId: UserID,
): Promise<User[]> {
  const found = await prisma.user.findMany({
    where: {
      sendingUsers: {
        some: {
          receivingUserId: userId,
          status: "PENDING",
        },
      },
    },
  });
  return found;
}

//ユーザーがリクエストしている人を探す 俺がリクエストしているのは誰だ
export async function findPendingRequestsFromUser(
  userId: UserID,
): Promise<User[]> {
  const found = await prisma.user.findMany({
    where: {
      receivingUsers: {
        some: {
          sendingUserId: userId,
          status: "PENDING",
        },
      },
    },
  });
  return found;
}

//マッチした人の取得
export async function searchMatchedUser(userId: UserID): Promise<User[]> {
  const found = await prisma.user.findMany({
    where: {
      OR: [
        {
          sendingUsers: {
            some: {
              receivingUserId: userId,
              status: "MATCHED",
            },
          },
        },
        {
          receivingUsers: {
            some: {
              sendingUserId: userId,
              status: "MATCHED",
            },
          },
        },
      ],
    },
  });
  return found;
}
