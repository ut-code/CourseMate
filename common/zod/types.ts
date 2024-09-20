import { z } from "zod";
import {
  UserIDSchema,
  GUIDSchema,
  IDTokenSchema,
  GenderSchema,
  RelationshipStatusSchema,
  UserSchema,
  InitUserSchema,
  UpdateUserSchema,
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
  NameSchema,
  PictureUrlSchema,
  ContentSchema,
  HobbySchema,
  IntroShortSchema,
  IntroLongSchema,
  CourseIDSchema,
  SlotSchema,
  CourseSchema,
  EnrollmentSchema,
  DaySchema,
  PeriodSchema,
} from "./schemas";

export type UserID = z.infer<typeof UserIDSchema>;
export type GUID = z.infer<typeof GUIDSchema>;
export type IDToken = z.infer<typeof IDTokenSchema>;
export type Name = z.infer<typeof NameSchema>;
export type PictureUrl = z.infer<typeof PictureUrlSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type RelationshipStatus = z.infer<typeof RelationshipStatusSchema>;
export type User = z.infer<typeof UserSchema>;
export type InitUser = z.infer<typeof InitUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type RelationshipID = z.infer<typeof RelationshipIDSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type CourseID = z.infer<typeof CourseIDSchema>;
export type Slot = z.infer<typeof SlotSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Enrollment = z.infer<typeof EnrollmentSchema>;
export type Day = z.infer<typeof DaySchema>;
export type Period = z.infer<typeof PeriodSchema>;
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
export type Content = z.infer<typeof ContentSchema>;
export type Hobby = z.infer<typeof HobbySchema>;
export type IntroShort = z.infer<typeof IntroShortSchema>;
export type IntroLong = z.infer<typeof IntroLongSchema>;
