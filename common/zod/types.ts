import { z } from "zod";
import {
  UserIDSchema,
  GUIDSchema,
  IDTokenSchema,
  // GenderSchema,
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
  UpdateRoomSchema,
  InitRoomSchema,
  InitSharedRoomSchema,
  TransformedGenderSchema,
} from "./schemas";

export type UserID = z.infer<typeof UserIDSchema>;
export type GUID = z.infer<typeof GUIDSchema>;
export type IDToken = z.infer<typeof IDTokenSchema>;
// export type Gender = z.infer<typeof GenderSchema>;
export type Gender = z.infer<typeof TransformedGenderSchema>;
export type RelationshipStatus = z.infer<typeof RelationshipStatusSchema>;
export type User = z.infer<typeof UserSchema>;
export type InitUser = z.infer<typeof InitUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type RelationshipID = z.infer<typeof RelationshipIDSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type MessageID = z.infer<typeof MessageIDSchema>;
export type ShareRoomID = z.infer<typeof ShareRoomIDSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type SendMessage = z.infer<typeof SendMessageSchema>;
export type DMOverview = z.infer<typeof DMOverviewSchema>;
export type SharedRoomOverview = z.infer<typeof SharedRoomOverviewSchema>;
export type RoomOverview = z.infer<typeof RoomOverviewSchema>;
export type DMRoom = z.infer<typeof DMRoomSchema>;
export type PersonalizedDMRoom = z.infer<typeof PersonalizedDMRoomSchema>;
export type SharedRoom = z.infer<typeof SharedRoomSchema>;
export type InitRoom = z.infer<typeof InitRoomSchema>;
export type InitSharedRoom = z.infer<typeof InitSharedRoomSchema>;
export type UpdateRoom = z.infer<typeof UpdateRoomSchema>;
