import { PrismaClient } from "@prisma/client";
import { Err, Ok, type Result } from "../common/lib/result";
import type { Relationship, UserID } from "../common/types";
import asyncMap from "../lib/async/map";

const prisma = new PrismaClient();

export async function getRelation(
  u1: UserID,
  u2: UserID,
): Promise<Result<Relationship>> {
  try {
    // TODO!!!! FIXME!!!!!! FIX THIS findMany!!!!!
    const rel = await prisma.relationship.findMany({
      where: {
        OR: [
          { sendingUserId: u1, receivingUserId: u2 },
          { sendingUserId: u2, receivingUserId: u1 },
        ],
      },
    });
    return rel[0] ? Ok(rel[0]) : Err(404);
  } catch (e) {
    return Err(e);
  }
}

export async function getRelations(
  user: UserID,
): Promise<Result<Relationship[]>> {
  try {
    const rels: Relationship[] = await prisma.relationship.findMany({
      where: {
        OR: [{ sendingUserId: user }, { receivingUserId: user }],
      },
    });
    return Ok(rels);
  } catch (e) {
    return Err(e);
  }
}

// returns false if u1 or u2 is not present.
export async function areMatched(u1: UserID, u2: UserID): Promise<boolean> {
  const match = await getRelation(u1, u2);
  if (!match.ok) return false;

  return match.value.status === "MATCHED";
}

export async function areAllMatched(
  user: UserID,
  friends: UserID[],
): Promise<Result<boolean>> {
  try {
    return Ok(
      (
        await asyncMap(friends, (friend) => {
          return areMatched(user, friend);
        })
      ).reduce((a, b) => a && b),
    );
  } catch (e) {
    return Err(e);
  }
}

// 特定のユーザIDを含むマッチの取得
export async function getMatchesByUserId(
  userId: UserID,
): Promise<Result<Relationship[]>> {
  try {
    const m = await prisma.relationship.findMany({
      where: {
        AND: [
          { status: "MATCHED" },
          { OR: [{ sendingUserId: userId }, { receivingUserId: userId }] },
        ],
      },
    });
    return Ok(m);
  } catch (e) {
    return Err(e);
  }
}

// マッチの削除
export async function deleteMatch(
  senderId: UserID,
  receiverId: UserID,
): Promise<Result<void>> {
  try {
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
      return Ok(undefined);
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
      return Ok(undefined);
    }

    // `No matching records found for senderId=${senderId} and receiverId=${receiverId}`,
    return Err(404);
  } catch (e) {
    return Err(e);
  }
}
