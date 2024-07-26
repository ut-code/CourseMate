import typia from "typia";
import { PublicUser, Relationship, User } from "./types";

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
