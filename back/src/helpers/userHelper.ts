import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ユーザーの作成
export async function createUser({
  uid,
  name,
  email,
  password,
}: {
  uid: string;
  name: string;
  email: string;
  password: string;
}) {
  try {
    const newUser = await prisma.user.create({
      data: {
        uid,
        name,
        email,
        password,
      },
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}

// ユーザーの取得
export async function getUser(uid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uid: uid,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

// ユーザーの更新
export async function updateUser({
  userId,
  name,
  email,
  password,
}: {
  userId: number;
  name?: string;
  email?: string;
  password?: string;
}) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, password },
    });
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

// ユーザーの削除
export async function deleteUser(userId: number) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser;
  } catch (error) {
    throw error;
  }
}

// ユーザーの全取得
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    throw error;
  }
}
