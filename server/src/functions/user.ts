import { PublicUser, User, GUID, UserID } from "../common/types";
import * as db from "../database/users";
import { getMatchedUser } from "../database/requests";
import * as http from "./share/http";

export function Public(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    pictureUrl: u.pictureUrl,
    intro: u.intro,
  };
}

export async function getAllUsers(): Promise<http.Response<User[]>> {
  const users = await db.getAllUsers();
  if (!users.ok) {
    console.error(users.error);
    return http.internalError();
  }
  return http.ok(users.value);
}

export async function getUser(guid: GUID): Promise<http.Response<User>> {
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

export async function userExists(guid: GUID): Promise<boolean> {
  const user = await db.getUser(guid);
  return user.ok;
}

export async function getMatched(user: UserID): Promise<http.Response<User[]>> {
  const matchedUsers = await getMatchedUser(user);
  if (!matchedUsers.ok) return http.internalError();

  return http.ok(matchedUsers.value);
}
