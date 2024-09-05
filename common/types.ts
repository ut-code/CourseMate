// common/type/types.ts

import type { UserID } from "./zod/types.ts";

// ENROLLMENTS

export type CourseID = string;

export type Course = {
  id: CourseID;
  name: string;
};

export type Enrollment = {
  id: number;
  userId: UserID;
  courseId: CourseID;
};

// TODO: schema.prisma との二重化を解消する
export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type CourseDayPeriod = {
  courseId: CourseID;
  day: Day;
  period: number;
};

export type {
  UserID,
  GUID,
  IDToken,
  Gender,
  RelationshipStatus,
  User,
  InitUser,
  UpdateUser,
  PublicUser,
  RelationshipID,
  Relationship,
  MessageID,
  ShareRoomID,
  Message,
  SendMessage,
  DMOverview,
  SharedRoomOverview,
  RoomOverview,
  DMRoom,
  PersonalizedDMRoom,
  SharedRoom,
  InitRoom,
  InitSharedRoom,
  UpdateRoom,
} from "./zod/types.ts";
