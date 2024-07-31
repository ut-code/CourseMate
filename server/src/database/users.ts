import { PrismaClient } from "@prisma/client";
import { GUID, UpdateUser, User, UserID } from "../common/types";

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
export async function getUserByID(id: UserID): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      id,
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

export function castUser(u: {
  id: number;
  guid: string;
  name: string;
  email: string;
  pictureUrl: string;
}): User {
  return {
    id: u.id as UserID,
    guid: u.guid as GUID,
    name: u.name,
    email: u.email,
    pictureUrl: u.pictureUrl,
  };
}
