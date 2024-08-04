import {
  UserIDSchema,
  GUIDSchema,
  IDTokenSchema,
  RelationshipStatusSchema,
  UserSchema,
  InitUserSchema,
  UpdateUserSchema,
  PublicUserSchema,
  RelationshipSchema,
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

// Function to parse Relationship
export const parseRelationship = (data: unknown) => {
  return RelationshipSchema.parse(data);
};
