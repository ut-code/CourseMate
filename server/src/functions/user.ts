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
  if (!users.ok) {
    console.error(users.error);
    return http.internalError();
  }
  return http.ok(users.value);
}

export async function getUser(
  guid: GUID,
): Promise<http.Response<UserWithCoursesAndSubjects>> {
  const user = await db.getUser(guid);
  if (!user.ok) {
    if (user.error === 404) return http.notFound();
    console.error(user.error);
    return http.internalError();
  }
  return http.ok(user.value);
}

export async function getUserByID(
  userId: UserID,
): Promise<http.Response<User>> {
  const user = await db.getUserByID(userId);
  if (!user.ok) {
    if (user.error === 404) return http.notFound();
    console.error(user.error);
    return http.internalError();
  }
  return http.ok(user.value);
}

export async function userExists(guid: GUID): Promise<http.Response<void>> {
  const user = await db.getUser(guid);
  if (user.ok) return http.ok(undefined);
  if (user.error === 404) return http.notFound(undefined);
  return http.internalError("db error");
}

export async function getMatched(
  user: UserID,
): Promise<http.Response<UserWithCoursesAndSubjects[]>> {
  const matchedUsers = await getMatchedUser(user);
  if (!matchedUsers.ok) return http.internalError();

  return http.ok(matchedUsers.value);
}
