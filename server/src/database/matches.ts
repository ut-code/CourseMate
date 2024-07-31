import { PrismaClient } from "@prisma/client";
import { UserID } from "../common/types";
import asyncMap from "../lib/async/map";

const prisma = new PrismaClient();

// returns false if u1 or u2 is not present.
export async function areMatched(u1: UserID, u2: UserID): Promise<boolean> {
  const match = await prisma.relationship.findUnique({
    where: {
      OR: [
        { AND: [{ sendingUserId: u1 }, { receivingUserId: u2 }] },
        { AND: [{ sendingUserId: u2 }, { receivingUserId: u1 }] },
      ],
    },
  });

  return match !== null && match.status === "MATCHED";
}

export async function areAllMatched(
  user: UserID,
  friends: UserID[],
): Promise<boolean> {
  return (
    await asyncMap(friends, (friend) => {
      return areMatched(user, friend);
    })
  ).reduce((a, b) => a && b);
}

// 特定のユーザIDを含むマッチの取得
export async function getMatchesByUserId(userId: UserID) {
  return await prisma.relationship.findMany({
    where: {
      AND: [
        { status: "MATCHED" },
        { OR: [{ sendingUserId: userId }, { receivingUserId: userId }] },
      ],
    },
  });
}

// マッチの削除
export async function deleteMatch(senderId: UserID, receiverId: UserID) {
  console.log("delete starting...");
  // 最初の条件で削除を試みる
  const recordToDelete = await prisma.relationship.findUnique({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: senderId,
        receivingUserId: receiverId,
      },
    },
  });

  if (recordToDelete) {
    await prisma.relationship.delete({
      where: {
        id: recordToDelete.id,
      },
    });
    console.log(
      `Deleted record with senderId=${senderId} and receiverId=${receiverId}`,
    );
    return;
  }

  // 次の条件で削除を試みる
  const altRecordToDelete = await prisma.relationship.findUnique({
    where: {
      sendingUserId_receivingUserId: {
        sendingUserId: receiverId,
        receivingUserId: senderId,
      },
    },
  });

  if (altRecordToDelete) {
    await prisma.relationship.delete({
      where: {
        id: altRecordToDelete.id,
      },
    });
    console.log(
      `Deleted record with senderId=${receiverId} and receiverId=${senderId}`,
    );
    return;
  }

  console.log(
    `No matching records found for senderId=${senderId} and receiverId=${receiverId}`,
  );
}
