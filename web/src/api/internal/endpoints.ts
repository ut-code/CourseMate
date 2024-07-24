const origin = import.meta.env.VITE_API_ENDPOINT;

// TODO: de-export this and use one from /common
export type UserID = number;

/**
 * [] 実装済み
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * - statuses:
 *   - 200: ok. 
 *     - body: User
 *   - 400: not found.
 *   - 500: internal error.
 *
 * [] 実装済み
 * PUT -> update user info.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 500: internal error.
 *
 * [] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: no content.
 *   - 500: internal error.
 *
 **/
const user = (userId: UserID) => {
  return `${origin}/users/id/${userId}`;
};

/**
 * [] 実装済み
 * GET -> list all users.
 * - statuses:
 *   - 200: good.
 *     - body: User[]
 *   - 500: internal error
 *
 * [] 実装済み
 * POST -> create user.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 201: created.
 *   - 500: internal error.
 *
 **/
const users = `${origin}/users`;

/**
 * Same as endpoints.user .
 *
 * [] 実装済み
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 400: not found.
 *   - 500: internal error.
 *
 * [] 実装済み
 * PUT -> update user info.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 500: internal error.
 *
 * [] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: no content.
 *   - 500: internal error.
 *
 **/
const userByGUID = (guid: string) => {
  return `${origin}/users/guid/${guid}`;
};

// this one may be public to anyone.
/**
 * [] 実装済み
 * GET -> check if the user exists.
 * - statuses:
 *   - 200: yes, user exists.
 *   - 404: no, user doesn't exist.
 *   - 500: internal error.
 **/
const userExists = (guid: string) => {
  return `${origin}/users/exists/${guid}`;
};

/**
 * [] 実装済み
 * DELETE -> delete match.
 * - statuses:
 *   - 204: deleted.
 *   - 404: you haven't matched the target user.
 *   - 500: internal error.
 **/
const match = (opponentID: UserID) => {
  return `${origin}/matches/${opponentID}`;
};

/**
 * [] 実装済み
 * GET -> list all matches.
 * - statuses:
 *   - 200: ok.
 *     - body: User[] // TODO: reconsider this
 *   - 500: internal error.
 **/
const matches = `${origin}/matches`;

/**
 * [] 実装済み
 * GET -> list all users that sent requests to you and the requests are not accepted yet.
 * - statuses:
 *   - 200: ok.
 *     - body: User[] // TODO: reconsider this
 *   - 500: internal error.
 **/
const requests = `${origin}/requests`;

/**
 * [] 実装済み
 * POST -> create request.
 * - status:
 *   - 201: Created.
 *   - 
 *
 * [] 実装済み
 * PUT -> accept request.
 * - status:
 *   - 201: Created.
 *   - 403: Forbidden. he hasn't sent a request to you.
 *   - 500: internal error.
 *
 * [] 実装済み
 * DELETE -> reject request.
 * - status:
 *   - 204: No content. successfully deleted.
 *   - 403: Forbidden. he hasn't sent a request to you.
 *   - 500: internal error.
 **/
const request = (receiverId: UserID) => {
  return `${origin}/requests/${receiverId}`;
};

export default {
  user,
  userByGUID,
  userExists,
  users,
  match,
  matches,
  requests,
  request,
};
