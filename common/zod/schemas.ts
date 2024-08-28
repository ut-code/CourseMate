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
export const GenderSchema = z.string();

export const RelationshipStatusSchema = z.union([
  z.literal("PENDING"),
  z.literal("MATCHED"),
  z.literal("REJECTED"),
]);

export const UserSchema = z.object({
  id: UserIDSchema,
  guid: GUIDSchema,
  name: z.string(),
  pictureUrl: z.string().url(),
  grade: z.string(),
  gender: GenderSchema,
  hobby: z.string(),
  intro_short: z.string(),
  intro_long: z.string(),
});

export const InitUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = InitUserSchema.omit({ guid: true });

export const PublicUserSchema = z.object({
  id: UserIDSchema,
  name: z.string(),
  pictureUrl: z.string().url(),
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

export const MessageSchema = z.object({
  id: MessageIDSchema,
  creator: UserIDSchema,
  createdAt: z.date(),
  content: z.string(),
  edited: z.boolean(),
});

export const SendMessageSchema = z.object({
  content: z.string(),
});

export const DMOverviewSchema = z.object({
  isDM: z.literal(true),
  friendId: UserIDSchema,
  name: z.string(),
  thumbnail: z.string(),
  lastmsg: MessageSchema.optional(),
});

export const SharedRoomOverviewSchema = z.object({
  isDM: z.literal(false),
  roomId: ShareRoomIDSchema,
  name: z.string(),
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
  name: z.string(),
  thumbnail: z.string(),
});

export const SharedRoomSchema = z.object({
  id: ShareRoomIDSchema,
  thumbnail: z.string(),
  name: z.string(),
  isDM: z.literal(false),
  members: z.array(UserIDSchema),
  messages: z.array(MessageSchema),
});

export const InitRoomSchema = SharedRoomSchema.omit({ id: true });

export const InitSharedRoomSchema = InitRoomSchema.extend({
  isDM: z.literal(false),
});

export const UpdateRoomSchema = z.object({
  name: z.string(),
  pictureUrl: z.string().url(),
});
