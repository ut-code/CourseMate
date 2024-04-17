import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ユーザーの作成
export async function createUser(name, email) {
  return await prisma.user.create({
    data: {
      name,
      email,
    },
  });
}

// ユーザーの取得
export async function getUser(userId) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

// ユーザーの更新
export async function updateUser(userId, name, email) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// ユーザーの削除
export async function deleteUser(userId) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
}
