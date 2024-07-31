import { z } from "zod";
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

export type UserID = z.infer<typeof UserIDSchema>;
export type GUID = z.infer<typeof GUIDSchema>;
export type IDToken = z.infer<typeof IDTokenSchema>;
export type RelationshipStatus = z.infer<typeof RelationshipStatusSchema>;
export type User = z.infer<typeof UserSchema>;
export type InitUser = z.infer<typeof InitUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
