type RelationshipStatus = "PENDING" | "MATCHED" | "REJECTED";

export type Relationship = {
  id: number;
  requestingUserId: number;
  requestedUserId: number;
  status: RelationshipStatus;
};

export type User = {
  id: number;
  uid: string;
  name: string;
  email: string;
};

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
