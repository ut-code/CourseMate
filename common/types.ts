type RelationshipStatus = "PENDING" | "MATCHED" | "REJECTED";

export type Relationship = {
  id: number;
  requestingUserId: UserID;
  requestedUserId: UserID;
  status: RelationshipStatus;
};

export type User = {
  id: UserID;
  guid: GUID;
  name: string;
  email: string;
  pictureUrl: string;
};

export type PartialUser = Omit<User, "id">;

export type PublicUser = {
  id: UserID;
  name: string;
  pictureUrl: string;
};
export function Public(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    pictureUrl: u.pictureUrl,
  };
}

/**
 * Google account's id.
 * recommended variable name: guid
 **/
export type GUID = string;

/**
 * User's ID used in database. do not assign string to this.
 * recommended variable name: id
 **/
export type UserID = number;
