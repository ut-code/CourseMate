import {
  ContentSchema,
  DMOverviewSchema,
  DMRoomSchema,
  GUIDSchema,
  GenderSchema,
  HobbySchema,
  IDTokenSchema,
  InitRoomSchema,
  InitSharedRoomSchema,
  InitUserSchema,
  IntroLongSchema,
  IntroShortSchema,
  MessageIDSchema,
  MessageSchema,
  NameSchema,
  PersonalizedDMRoomSchema,
  PictureUrlSchema,
  RelationshipIDSchema,
  RelationshipSchema,
  RelationshipStatusSchema,
  RoomOverviewSchema,
  SendMessageSchema,
  ShareRoomIDSchema,
  SharedRoomOverviewSchema,
  SharedRoomSchema,
  Step1UserSchema,
  UpdateRoomSchema,
  UpdateUserSchema,
  UserIDSchema,
  UserSchema,
} from "./schemas";

export function parseUserID(data: unknown) {
  return UserIDSchema.parse(data);
}

export function parseGUID(data: unknown) {
  return GUIDSchema.parse(data);
}

export function parseIDToken(data: unknown) {
  return IDTokenSchema.parse(data);
}

export function parseName(data: unknown) {
  return NameSchema.parse(data);
}

export function parsePictureUrl(data: unknown) {
  return PictureUrlSchema.parse(data);
}

export function parseGender(data: unknown) {
  return GenderSchema.parse(data);
}

export function parseRelationshipStatus(data: unknown) {
  return RelationshipStatusSchema.parse(data);
}

export function parseUser(data: unknown) {
  return UserSchema.parse(data);
}

export function parseInitUser(data: unknown) {
  return InitUserSchema.parse(data);
}

export function parseUpdateUser(data: unknown) {
  return UpdateUserSchema.parse(data);
}

export function parseStep1UserSchema(data: unknown) {
  return Step1UserSchema.parse(data);
}

export function parseRelationshipID(data: unknown) {
  return RelationshipIDSchema.parse(data);
}

export function parseRelationship(data: unknown) {
  return RelationshipSchema.parse(data);
}

export function parseMessageID(data: unknown) {
  return MessageIDSchema.parse(data);
}

export function parseShareRoomID(data: unknown) {
  return ShareRoomIDSchema.parse(data);
}

export function parseMessage(data: unknown) {
  return MessageSchema.parse(data);
}

export function parseSendMessage(data: unknown) {
  return SendMessageSchema.parse(data);
}

export function parseDMOverview(data: unknown) {
  return DMOverviewSchema.parse(data);
}

export function parseSharedRoomOverview(data: unknown) {
  return SharedRoomOverviewSchema.parse(data);
}

export function parseRoomOverview(data: unknown) {
  return RoomOverviewSchema.parse(data);
}

export function parseDMRoom(data: unknown) {
  return DMRoomSchema.parse(data);
}

export function parsePersonalizedDMRoom(data: unknown) {
  return PersonalizedDMRoomSchema.parse(data);
}

export function parseSharedRoom(data: unknown) {
  return SharedRoomSchema.parse(data);
}

export function parseInitRoom(data: unknown) {
  return InitRoomSchema.parse(data);
}

export function parseInitSharedRoom(data: unknown) {
  return InitSharedRoomSchema.parse(data);
}

export function parseUpdateRoom(data: unknown) {
  return UpdateRoomSchema.parse(data);
}

export function parseContent(data: unknown) {
  return ContentSchema.parse(data);
}

export function parseHobby(data: unknown) {
  return HobbySchema.parse(data);
}

export function parseIntroShort(data: unknown) {
  return IntroShortSchema.parse(data);
}

export function parseIntroLong(data: unknown) {
  return IntroLongSchema.parse(data);
}
