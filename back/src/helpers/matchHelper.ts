import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 特定のユーザIDを含むマッチの取得
export async function getMatchesByUserId(userId: number) {
  try {
    return await prisma.relationship.findMany({
      where: {
        AND: [
          { status: "MATCHED" },
          { OR: [{ requestingUserId: userId }, { requestedUserId: userId }] },
        ],
      },
    });
  } catch (error) {
    throw error;
  }
}

// マッチの削除
export async function deleteMatch(relationshipId: number) {
  try {
    return await prisma.relationship.delete({
      where: { id: relationshipId },
    });
  } catch (error) {
    throw error;
  }
}
