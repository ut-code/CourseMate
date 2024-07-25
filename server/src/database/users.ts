import { PrismaClient } from "@prisma/client";
import { GUID, User } from "../../../common/types";

const prisma = new PrismaClient();

// ユーザーの作成
export async function createUser(partialUser: Omit<User, "id">) {
  const newUser = await prisma.user.create({
    data: partialUser,
  });
  return newUser;
}

// ユーザーの取得
export async function getUser(guid: GUID) {
  const user = await prisma.user.findUnique({
    where: {
      guid: guid,
    },
  });
  return user;
}

// ユーザーの更新
export async function updateUser(
  userId: number,
  partialUser: Omit<User, "id">,
) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: partialUser,
  });
  return updatedUser;
}

// ユーザーの削除
export async function deleteUser(userId: number) {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser;
}

// ユーザーの全取得
export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}
