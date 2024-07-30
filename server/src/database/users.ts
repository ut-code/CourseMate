import { PrismaClient } from "@prisma/client";
import { GUID, InitUser, UpdateUser, UserID } from "../../../common/types";

const prisma = new PrismaClient();

// ユーザーの作成
export async function createUser(partialUser: InitUser) {
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
export async function updateUser(userId: UserID, partialUser: UpdateUser) {
  // undefined means do nothing to this field
  // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined#use-case-null-and-undefined-in-a-graphql-resolver
  const updateUser = {
    id: undefined,
    guid: undefined,
    ...partialUser,
  };
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateUser,
  });
  return updatedUser;
}

// ユーザーの削除
export async function deleteUser(userId: UserID) {
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
