import {
  UserIDSchema,
  GUIDSchema,
  IDTokenSchema,
  GenderSchema,
  RelationshipStatusSchema,
  UserSchema,
  InitUserSchema,
  UpdateUserSchema,
  PublicUserSchema,
  RelationshipIDSchema,
  RelationshipSchema,
  MessageIDSchema,
  ShareRoomIDSchema,
  MessageSchema,
  SendMessageSchema,
  DMOverviewSchema,
  SharedRoomOverviewSchema,
  RoomOverviewSchema,
  DMRoomSchema,
  PersonalizedDMRoomSchema,
  SharedRoomSchema,
  InitRoomSchema,
  InitSharedRoomSchema,
  UpdateRoomSchema,
} from "./schemas";

// Function to parse UserID
export const parseUserID = (data: unknown) => {
  return UserIDSchema.parse(data);
};

// Function to parse GUID
export const parseGUID = (data: unknown) => {
  return GUIDSchema.parse(data);
};

// Function to parse ID Token
export const parseIDToken = (data: unknown) => {
  return IDTokenSchema.parse(data);
};

// Function to parse Gender
export const parseGender = (data: unknown) => {
  return GenderSchema.parse(data);
};

// Function to parse Relationship Status
export const parseRelationshipStatus = (data: unknown) => {
  return RelationshipStatusSchema.parse(data);
};

// Function to parse User
export const parseUser = (data: unknown) => {
  return UserSchema.parse(data);
};

// Function to parse InitUser
export const parseInitUser = (data: unknown) => {
  return InitUserSchema.parse(data);
};

// Function to parse UpdateUser
export const parseUpdateUser = (data: unknown) => {
  return UpdateUserSchema.parse(data);
};

// Function to parse PublicUser
export const parsePublicUser = (data: unknown) => {
  return PublicUserSchema.parse(data);
};

// Function to parse Relationship ID
export const parseRelationshipID = (data: unknown) => {
  return RelationshipIDSchema.parse(data);
};

// Function to parse Relationship
export const parseRelationship = (data: unknown) => {
  return RelationshipSchema.parse(data);
};

// Function to parse Message ID
export const parseMessageID = (data: unknown) => {
  return MessageIDSchema.parse(data);
};

// Function to parse ShareRoom ID
export const parseShareRoomID = (data: unknown) => {
  return ShareRoomIDSchema.parse(data);
};

// Function to parse Message
export const parseMessage = (data: unknown) => {
  return MessageSchema.parse(data);
};

// Function to parse SendMessage
export const parseSendMessage = (data: unknown) => {
  return SendMessageSchema.parse(data);
};

// Function to parse DMOverview
export const parseDMOverview = (data: unknown) => {
  return DMOverviewSchema.parse(data);
};

// Function to parse SharedRoomOverview
export const parseSharedRoomOverview = (data: unknown) => {
  return SharedRoomOverviewSchema.parse(data);
};

// Function to parse RoomOverview
export const parseRoomOverview = (data: unknown) => {
  return RoomOverviewSchema.parse(data);
};

// Function to parse DMRoom
export const parseDMRoom = (data: unknown) => {
  return DMRoomSchema.parse(data);
};

// Function to parse PersonalizedDMRoom
export const parsePersonalizedDMRoom = (data: unknown) => {
  return PersonalizedDMRoomSchema.parse(data);
};

// Function to parse SharedRoom
export const parseSharedRoom = (data: unknown) => {
  return SharedRoomSchema.parse(data);
};

// Function to parse InitRoom
export const parseInitRoom = (data: unknown) => {
  return InitRoomSchema.parse(data);
};

// Function to parse InitSharedRoom
export const parseInitSharedRoom = (data: unknown) => {
  return InitSharedRoomSchema.parse(data);
};

// Function to parse UpdateRoom
export const parseUpdateRoom = (data: unknown) => {
  return UpdateRoomSchema.parse(data);
};
