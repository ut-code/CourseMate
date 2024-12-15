import { z } from "zod";

export const UserIDSchema = z.number();
export const GUIDSchema = z.string();
export const IDTokenSchema = z.string();

//TODO: make z.union([
//   MALE
//   FEMALE
//   OTHER
//   SECRET
// ])
export const NameSchema = z
  .string()
  .min(1, { message: "名前は1文字以上です" })
  .max(10, { message: "名前は10文字以下です" });
export const PictureUrlSchema = z.string().url().min(1, "画像を選択して下さい");
export const GenderSchema = z
  .string()
  .min(1, { message: "性別を入力して下さい" });

export const HobbySchema = z
  .string()
  // .min(1, { message: "趣味は1文字以上です" })
  .max(25, { message: "趣味は25文字以下です" });
export const IntroShortSchema = z
  .string()
  .min(2, { message: "コメントは2文字以上です" })
  .max(25, { message: "コメントは25文字以下です" });
export const IntroLongSchema = z
  .string()
  // .min(2, { message: "自己紹介文は2文字以上です" })
  .max(225, { message: "自己紹介文は225文字以下です" });

export const InterestSubjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  group: z.string(),
});

export const InterestSchema = z.object({
  userId: UserIDSchema,
  subjectId: z.number(),
});

export const UserSchema = z.object({
  id: UserIDSchema,
  guid: GUIDSchema,
  name: NameSchema,
  gender: GenderSchema,
  grade: z.string().min(1, { message: "学年を入力して下さい" }),
  faculty: z.string().min(1, { message: "学部を入力して下さい" }), // TODO: validate this further
  department: z.string().min(1, { message: "学科を入力して下さい" }), // same
  intro: z.string().max(150, { message: "自己紹介文は150文字以下です" }),
  pictureUrl: z.string(),
});

export const RelationshipStatusSchema = z.union([
  z.literal("PENDING"),
  z.literal("MATCHED"),
  z.literal("REJECTED"),
]);

export const InitUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = InitUserSchema.omit({ guid: true });
export const Step1UserSchema = UpdateUserSchema.omit({ pictureUrl: true });

export const RelationshipIDSchema = z.number();

export const RelationshipSchema = z.object({
  id: z.number(),
  sendingUserId: UserIDSchema,
  receivingUserId: UserIDSchema,
  status: RelationshipStatusSchema,
});

export const CourseIDSchema = z.string();

export const DaySchema = z.enum([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
  "other",
]);

export const PeriodSchema = z.number().min(0).max(6);

export const SlotSchema = z.object({
  day: DaySchema,
  period: PeriodSchema,
  courseId: CourseIDSchema,
});

export const CourseSchema = z.object({
  id: CourseIDSchema,
  name: z.string(),
  teacher: z.string(),
  slots: SlotSchema.array(),
});

export const EnrollmentSchema = z.object({
  id: z.number(),
  userId: UserIDSchema,
  courseId: CourseIDSchema,
});

export const UserWithCoursesAndSubjectsSchema = UserSchema.extend({
  courses: CourseSchema.array(),
  interestSubjects: InterestSubjectSchema.array(),
});

export const MessageIDSchema = z.number(); // TODO! Add __internal_prevent_cast_MessageID: PhantomData
export const ShareRoomIDSchema = z.number();

export const ContentSchema = z
  .string()
  .min(1, { message: "Content must not be empty." })
  .max(255, { message: "Content is too big" });

export const MessageSchema = z.object({
  id: MessageIDSchema,
  creator: UserIDSchema,
  createdAt: z.date(),
  content: ContentSchema,
  edited: z.boolean(),
});

export const SendMessageSchema = z.object({
  content: z.string().min(1, { message: "Content must not be empty." }),
});

export const MatchingStatusSchema = z.union([
  z.literal("myRequest"),
  z.literal("otherRequest"),
  z.literal("matched"),
]);

export const DMOverviewSchema = z.object({
  isDM: z.literal(true),
  matchingStatus: MatchingStatusSchema,
  friendId: UserIDSchema,
  name: NameSchema,
  thumbnail: z.string(),
  lastMsg: MessageSchema.optional(),
});

export const SharedRoomOverviewSchema = z.object({
  isDM: z.literal(false),
  roomId: ShareRoomIDSchema,
  name: NameSchema,
  thumbnail: z.string(),
  lastMsg: MessageSchema.optional(),
});

export const RoomOverviewSchema = z.union([
  SharedRoomOverviewSchema,
  DMOverviewSchema,
]);

export const DMRoomSchema = z.object({
  id: RelationshipIDSchema,
  isDM: z.literal(true),
  messages: z.array(MessageSchema),
});

export const PersonalizedDMRoomSchema = z.object({
  name: NameSchema,
  thumbnail: z.string(),
  matchingStatus: MatchingStatusSchema,
});

export const SharedRoomSchema = z.object({
  id: ShareRoomIDSchema,
  thumbnail: z.string(),
  name: NameSchema,
  isDM: z.literal(false),
  members: z.array(UserIDSchema),
  messages: z.array(MessageSchema),
});

export const InitRoomSchema = SharedRoomSchema.omit({ id: true });

export const InitSharedRoomSchema = InitRoomSchema.extend({
  isDM: z.literal(false),
});

export const UpdateRoomSchema = z.object({
  name: NameSchema,
  pictureUrl: PictureUrlSchema,
});
