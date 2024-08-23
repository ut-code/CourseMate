/** WARNING
------------------
if this is in server/src or web/src, this file is generated.
do NOT edit this file. instead, edit the one in coursemate/common/.
------------------
// GLOBAL

/**
 * Google account's id.
 * recommended variable name: guid
 **/
export type GUID = string;
// TODO!& { __internal_prevent_implicit_cast_GUID: PhantomData; };

/**
 * User's ID used in database. do not assign string to this.
 * recommended variable name: id
 **/
export type UserID = number;
// TODO! & { __internal_prevent_implicit_cast_UserID: PhantomData; };

/**
 * Firebase ID Token.
 **/
export type IDToken = string;

export type Gender = "男性" | "女性" | "その他" | "秘密";
export type User = {
  id: UserID;
  guid: GUID;
  name: string;
  pictureUrl: string;
  grade: string;
  gender: string; // TODO: use Gender instead of string
  hobby: string;
  intro_short: string;
  intro_long: string;
};

export type InitUser = Omit<User, "id">;
export type UpdateUser = Omit<InitUser, "guid">;

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
// MATCHES

export type RelationshipStatus = "PENDING" | "MATCHED" | "REJECTED";
export type RelationshipID = number;
// TODO! & { __internal_prevent_implicit_cast: never; };

export type Relationship = {
  id: RelationshipID;
  sendingUserId: UserID;
  receivingUserId: UserID;
  status: RelationshipStatus;
};

/*
# Chat Rooms

- chat (domain)
  - Room (= All chattable places)
    - log
  - DM : part of Room
  - SharedRoom : also part of Room
*/

// type PhantomData = never;

export type MessageID = number; // TODO! & { __internal_prevent_cast_MessageID: PhantomData; };
export type ShareRoomID = number; // TDOO! & {__internal_prevent_cast_RoomID: PhantomData;};
export type Message = {
  id: MessageID;
  creator: UserID;
  createdAt: Date;
  content: string;
  edited: boolean;
};

export type SendMessage = {
  content: string;
};

// the data type to be displayed at initial screen (in list)
export type RoomOverview = SharedRoomOverview | DMOverview;

export type DMOverview = {
  isDM: true;
  friendId: UserID;
  name: string;
  thumbnail: string;
  lastmsg?: Message;
};

export type SharedRoomOverview = {
  isDM: false;
  roomId: ShareRoomID;
  name: string;
  thumbnail: string;
  lastmsg?: Message;
};

export type DMRoom = {
  id: RelationshipID;
  isDM: true;
  messages: Message[];
};
export type PersonalizedDMRoom = {
  name: string;
  thumbnail: string;
};

export type SharedRoom = {
  id: ShareRoomID;
  thumbnail: string;
  name: string;
  isDM: false;
  members: UserID[];
  messages: Message[];
};

export type InitRoom = Omit<Omit<SharedRoom, "id">, "log">;
export type InitSharedRoom = InitRoom & { isDM: false };

export type UpdateRoom = {
  name: string;
  pictureUrl: string;
};
