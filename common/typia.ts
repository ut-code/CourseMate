import typia from "typia";
import {
  GUID,
  PartialUser,
  PublicUser,
  Relationship,
  User,
  UserID,
} from "./types";

//引数が指定した型に対して正しいかどうかを検証する
export const assertUser = typia.createAssert<User>();
export const assertRelationship = typia.createAssert<Relationship>();
export const assertPublicUser = typia.createAssert<PublicUser>();
export const assertUserID = typia.createAssert<UserID>();
export const assertGUID = typia.createAssert<GUID>();
export const assertPartialUser = typia.createAssert<PartialUser>();
