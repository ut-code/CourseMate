import { PrismaClient } from "@prisma/client";
import { User } from "../../../common/types";

const prisma = new PrismaClient();

// ユーザーの作成
<<<<<<< Updated upstream
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
  const newUser = await prisma.user.create({
    data: {
      uid,
      name,
      email,
      password,
    },
=======
export async function createUser(partialUser: Omit<User, "id">) {
  const newUser = await prisma.user.create({
    data: partialUser,
>>>>>>> Stashed changes
  });
  return newUser;
}

// ユーザーの取得
export async function getUser(uid: string) {
  const user = await prisma.user.findUnique({
    where: {
      uid: uid,
    },
  });
  return user;
}

// ユーザーの更新
<<<<<<< Updated upstream
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
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email, password },
=======
export async function updateUser(userId: Number, newUser: Omit<User, "id">) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: newUser,
>>>>>>> Stashed changes
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
