import { z } from "zod";

export const UserIDSchema = z.number();
export const GUIDSchema = z.string();
export const IDTokenSchema = z.string();

export const RelationshipStatusSchema = z.union([
  z.literal("PENDING"),
  z.literal("MATCHED"),
  z.literal("REJECTED"),
]);

export const UserSchema = z.object({
  id: UserIDSchema,
  guid: GUIDSchema,
  name: z.string(),
  email: z.string().email(),
  pictureUrl: z.string().url(),
});

export const InitUserSchema = UserSchema.omit({ id: true });
export const UpdateUserSchema = InitUserSchema.omit({ guid: true });

export const PublicUserSchema = z.object({
  id: UserIDSchema,
  name: z.string(),
  pictureUrl: z.string().url(),
});

export const RelationshipSchema = z.object({
  id: z.number(),
  sendingUserId: UserIDSchema,
  receivingUserId: UserIDSchema,
  status: RelationshipStatusSchema,
});