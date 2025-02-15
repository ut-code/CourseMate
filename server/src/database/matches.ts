import { error, panic } from "common/lib/panic";
import type { Relationship, UserID } from "common/types";
import asyncMap from "../lib/async/map";
import { prisma } from "./client";

export async function getRelation(
  u1: UserID,
  u2: UserID,
): Promise<Relationship> {
  // FIXME: fix this findMany
  const rel = await prisma.relationship.findMany({
    where: {
      OR: [
        { sendingUserId: u1, receivingUserId: u2 },
        { sendingUserId: u2, receivingUserId: u1 },
      ],
    },
  });
  return rel[0] ?? panic("not found");
}

export async function getRelations(user: UserID): Promise<Relationship[]> {
  const relations: Relationship[] = await prisma.relationship.findMany({
    where: {
      OR: [{ sendingUserId: user }, { receivingUserId: user }],
    },
  });
  return relations;
}

// returns false if u1 or u2 is not present.
export async function areMatched(u1: UserID, u2: UserID): Promise<boolean> {
  const match = await getRelation(u1, u2);
  if (!match) return false;

  return match.status === "MATCHED";
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
export async function getMatchesByUserId(
  userId: UserID,
): Promise<Relationship[]> {
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
export async function deleteMatch(
  senderId: UserID,
  receiverId: UserID,
): Promise<void> {
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
    await prisma.relationship.update({
      where: {
        id: recordToDelete.id,
      },
      data: {
        status: "REJECTED",
      },
    });
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
    await prisma.relationship.update({
      where: {
        id: altRecordToDelete.id,
      },
      data: {
        status: "REJECTED",
      },
    });
    return;
  }

  // `No matching records found for senderId=${senderId} and receiverId=${receiverId}`,
  error("not found", 404);
}
