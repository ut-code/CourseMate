type RelationshipStatus = "PENDING" | "MATCHED" | "REJECTED";

export type Relationship = {
  id: number;
  requestingUserId: number;
  requestedUserId: number;
  status: RelationshipStatus;
};

export type User = {
  id: number;
  guid: GUID;
  name: string;
  email: string;
  pictureUrl: string;
};

export type PublicUser = {
  id: number;
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
