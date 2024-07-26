import typia from "typia";
import {
  GUID,
  PartialUser,
  PublicUser,
  Relationship,
  User,
  UserID,
} from "./types";

//引数がUser型に対して正しいかどうかをチェックする
export function assertUser(input: unknown): User {
  return typia.assert<User>(input);
}

export function assertRelationship(input: unknown): Relationship {
  return typia.assert<Relationship>(input);
}

export function assertPublicUser(input: unknown): PublicUser {
  return typia.assert<PublicUser>(input);
}

export function assertUserID(input: unknown): UserID {
  return typia.assert<UserID>(input);
}

export function assertGUID(input: unknown): GUID {
  return typia.assert<GUID>(input);
}

export function assertPartialUser(input: unknown): PartialUser {
  return typia.assert<PartialUser>(input);
}
