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
export const PictureUrlSchema = z.string().url();
export const GenderSchema = z
  .string()
  .min(1, { message: "Gender must not be empty." });

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

export const UserSchema = z.object({
  id: UserIDSchema,
  guid: GUIDSchema,
  name: NameSchema,
  pictureUrl: z.string(),
  grade: z.string(),
  gender: GenderSchema,
  hobby: HobbySchema,
  intro_short: IntroShortSchema,
  intro_long: IntroLongSchema,
});

export const RelationshipStatusSchema = z.union([
  z.literal("PENDING"),
  z.literal("MATCHED"),
  z.literal("REJECTED"),
]);

export const InitUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = InitUserSchema.omit({ guid: true });

export const PublicUserSchema = z.object({
  id: UserIDSchema,
  name: NameSchema,
  pictureUrl: PictureUrlSchema,
  intro_short: z
    .string()
    .min(1, { message: "Short introduction must not be empty." }),
});

export const RelationshipIDSchema = z.number();

export const RelationshipSchema = z.object({
  id: z.number(),
  sendingUserId: UserIDSchema,
  receivingUserId: UserIDSchema,
  status: RelationshipStatusSchema,
});

export const MessageIDSchema = z.number(); // TODO! Add __internal_prevent_cast_MessageID: PhantomData
export const ShareRoomIDSchema = z.number();

export const ContentSchema = z
  .string()
  .min(1, { message: "Content must not be empty." });

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

export const DMOverviewSchema = z.object({
  isDM: z.literal(true),
  friendId: UserIDSchema,
  name: NameSchema,
  thumbnail: z.string(),
  lastmsg: MessageSchema.optional(),
});

export const SharedRoomOverviewSchema = z.object({
  isDM: z.literal(false),
  roomId: ShareRoomIDSchema,
  name: NameSchema,
  thumbnail: z.string(),
  lastmsg: MessageSchema.optional(),
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
