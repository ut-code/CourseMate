// GLOBAL

/**
 * Google account's id.
 * recommended variable name: guid
 **/
export type GUID = string & {
  __internal_prevent_implicit_cast_GUID: PhantomData;
};

/**
 * User's ID used in database. do not assign string to this.
 * recommended variable name: id
 **/
export type UserID = number & {
  __internal_prevent_implicit_cast_UserID: PhantomData;
};

/**
 * Firebase ID Token.
 **/
export type IDToken = string;

export type User = {
  id: UserID;
  guid: GUID;
  name: string;
  email: string;
  pictureUrl: string;
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

type RelationshipStatus = "PENDING" | "MATCHED" | "REJECTED";

export type Relationship = {
  id: number;
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

type PhantomData = never;

export type MessageID = number & {
  __internal_prevent_cast_MessageID: PhantomData;
};
export type ShareRoomID = number & {
  __internal_prevent_cast_RoomID: PhantomData;
};
export type DMRoomID = number & { __internal_prevent_cast_DMID: PhantomData };
export type Message = {
  id: MessageID;
  sender: UserID;
  content: string;
  createdAt: Date;
};

export type SendMessage = {
  content: string;
};

// the data type to be displayed at initial screen (in list)
export type RoomOverview = SharedRoomOverview | DMOverview;

export type DMOverview = {
  thumbnail: string;
  lastmsg?: Message;
  isDM: true;
  dmid: DMRoomID;
};

export type SharedRoomOverview = {
  thumbnail: string;
  lastmsg?: Message;
  isDM: false;
  roomId: ShareRoomID;
};

export type DMRoom = {
  id: DMRoomID; // TODO: should this use Relationship.ID or RoomID?
  isDM: true;
  member: User[];
  messages: Message[];
};

export type SharedRoom = {
  id: ShareRoomID;
  name: string;
  isDM: false;
  member: User[];
  messages: Message[];
};

export type InitRoom = Omit<Omit<SharedRoom, "id">, "log">;
export type InitSharedRoom = InitRoom & { isDM: false };

export type UpdateRoom = {
  name: string;
  pictureUrl: string;
};
