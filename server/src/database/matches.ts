import { PrismaClient } from "@prisma/client";
import { UserID, Relationship, RelationshipID } from "../common/types";
import asyncMap from "../lib/async/map";

const prisma = new PrismaClient();

export async function findRelation(
  u1: UserID,
  u2: UserID
): Promise<Relationship | null> {
  // TODO!!!! FIXME!!!!!! FIX THIS findMany!!!!!
  const rel = await prisma.relationship.findMany({
    where: {
      OR: [
        { sendingUserId: u1, receivingUserId: u2 },
        { sendingUserId: u2, receivingUserId: u1 },
      ],
    },
  });
  return rel[0]
    ? {
        id: rel[0].id as RelationshipID,
        sendingUserId: rel[0].sendingUserId as UserID,
        receivingUserId: rel[0].receivingUserId as UserID,
        status: rel[0].status,
      }
    : null;
}

// returns false if u1 or u2 is not present.
export async function areMatched(u1: UserID, u2: UserID): Promise<boolean> {
  const match = await findRelation(u1, u2);

  return match !== null && match.status === "MATCHED";
}

export async function areAllMatched(
  user: UserID,
  friends: UserID[]
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
      `Deleted record with senderId=${senderId} and receiverId=${receiverId}`
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
      `Deleted record with senderId=${receiverId} and receiverId=${senderId}`
    );
    return;
  }

  console.log(
    `No matching records found for senderId=${senderId} and receiverId=${receiverId}`
  );
}
