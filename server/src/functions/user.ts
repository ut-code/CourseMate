import type {
  GUID,
  User,
  UserID,
  UserWithCoursesAndSubjects,
} from "common/types";
import { getMatchedUser } from "../database/requests";
import * as db from "../database/users";
import * as http from "./share/http";

export async function getAllUsers(): Promise<http.Response<User[]>> {
  const users = await db.getAllUsers();
  return http.ok(users);
}

export async function getUser(
  guid: GUID,
): Promise<http.Response<UserWithCoursesAndSubjects>> {
  const user = await db.getUser(guid);
  return http.ok(user);
}

export async function getUserByID(
  userId: UserID,
): Promise<http.Response<User>> {
  const user = await db.getUserByID(userId);
  return http.ok(user);
}

export async function userExists(guid: GUID): Promise<http.Response<void>> {
  const user = await db.getUser(guid);
  if (user) return http.ok(undefined);
  if (user === 404) return http.notFound(undefined);
  return http.internalError("db error");
}

export async function getMatched(
  user: UserID,
): Promise<http.Response<UserWithCoursesAndSubjects[]>> {
  const matchedUsers = await getMatchedUser(user);
  if (!matchedUsers) return http.internalError();

  return http.ok(matchedUsers);
}
