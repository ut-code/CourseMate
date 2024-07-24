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
 * [v] 実装済み
 * PUT -> update user info.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 500: internal error.
 *
 * [v] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: deleted, t.f. no content.
 *   - 500: internal error.
 *
 **/
const user = (userId: UserID) => {
  return `${origin}/users/id/${userId}`;
};

/**
 * [v] 実装済み
 * GET -> list all users.
 * - statuses:
 *   - 200: good.
 *     - body: User[]
 *   - 500: internal error
 *
 * [v] 実装済み
 * POST -> create user.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 201: created.
 *   - 500: internal error.
 *
 **/
const users = `${origin}/users`;

/**
 * [] 実装済み
 * GET -> list all matched users.
 * - statuses:
 *   - 200: ok.
 *     - body: User[]
 *   ...TODO!
 **/
const matchedUsers = `${origin}/users/matched`;
/**
 * [] 実装済み
 * GET -> list all users that sent request to you.
 * - statuses:
 *   - 200: ok.
 *     - body: User[]
 *   ...TODO!
 **/
const pendingUsers = `${origin}/users/pending`;

/**
 * [v] 実装済み
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 400: not found.
 *   - 500: internal error.
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
 * [v] 実装済み
 * DELETE -> delete match.
 * - statuses:
 *   - 204: deleted.
 *   - 401: unauthorized.
 *   - 404: you haven't matched the target user. 
 *          (not implemented at server) 
 *   - 500: internal error.
 **/
const match = (opponentID: UserID) => {
  return `${origin}/matches/${opponentID}`;
};

/**
 * [v] 実装済み
 * GET -> list all matches.
 * - statuses:
 *   - 200: ok.
 *     - body: Relationship[] where relation.status === "MATCHED"
 *            // shouldn't it be User[]?
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
const matches = `${origin}/matches`;


/**
 * [x] 実装済み
 * GET -> list all requests that are sent to you and not accepted yet.
 * - statuses:
 *   - 200: ok.
 *     - body: Relationship[] where relation.status === "PENDING"
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
const requests = `${origin}/requests`;

/**
 * [v] 実装済み
 * POST -> create request.
 * - status:
 *   - 201: Created.
 *   - 401: unauthorized.
 *   - 500: internal error.
 *
 * [v] 実装済み
 * PUT -> accept request.
 * - status:
 *   - 201: Created.
 *   - 403: (not implemented) Forbidden. he hasn't sent a request to you.
 *   - 500: internal error.
 *
 * [v] 実装済み
 * DELETE -> reject request.
 * - status:
 *   - 204: No content. successfully deleted.
 *   - 401: unauthorized.
 *   - 404: (not implemented) Not found. he hasn't sent a request to you.
 *   - 500: internal error.
 **/
const request = (opponentId: UserID) => {
  return `${origin}/requests/${opponentId}`;
};

export default {
  user,
  userByGUID,
  userExists,
  users,
  matchedUsers,
  pendingUsers,
  match,
  matches,
  requests,
  request,
};
