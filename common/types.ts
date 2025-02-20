// common/type/types.ts

import type { Message, UserID } from "./zod/types.ts";

export type {
  UserID,
  GUID,
  IDToken,
  Gender,
  RelationshipStatus,
  InterestSubject,
  Interest,
  User,
  InitUser,
  UpdateUser,
  RelationshipID,
  Relationship,
  CourseID,
  InterestSubjectID,
  Slot,
  Course,
  Enrollment,
  Day,
  UserWithCoursesAndSubjects,
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

export type SSEChatEvents = {
  "Chat:Append": {
    message: Message;
    sender: string; // user name
  };
  "Chat:Update": {
    id: number;
    message: Message;
  };
  "Chat:Delete": {
    id: number;
  };
  "Chat:Ping": "";
};
export type SSEChatEventEnum = "Chat:Append" | "Chat:Update" | "Chat:Delete";
export type SSEChatEvent<T extends SSEChatEventEnum> = {
  event: T;
  data: SSEChatEvents[T];
};
