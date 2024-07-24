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
<<<<<<< Updated upstream
<<<<<<< HEAD
 * [v] 実装済み
=======
 * [] 実装済み
>>>>>>> main
=======
 * [v] 実装済み
>>>>>>> Stashed changes
 * PUT -> update user info.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 500: internal error.
 *
<<<<<<< Updated upstream
<<<<<<< HEAD
 * [v] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: deleted, t.f. no content.
=======
 * [] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: no content.
>>>>>>> main
=======
 * [v] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: deleted, t.f. no content.
>>>>>>> Stashed changes
 *   - 500: internal error.
 *
 **/
const user = (userId: UserID) => {
  return `${origin}/users/id/${userId}`;
};

/**
<<<<<<< Updated upstream
<<<<<<< HEAD
 * [v] 実装済み
=======
 * [] 実装済み
>>>>>>> main
=======
 * [v] 実装済み
>>>>>>> Stashed changes
 * GET -> list all users.
 * - statuses:
 *   - 200: good.
 *     - body: User[]
 *   - 500: internal error
 *
<<<<<<< Updated upstream
<<<<<<< HEAD
 * [v] 実装済み
=======
 * [] 実装済み
>>>>>>> main
=======
 * [v] 実装済み
>>>>>>> Stashed changes
 * POST -> create user.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 201: created.
 *   - 500: internal error.
 *
 **/
const users = `${origin}/users`;

/**
<<<<<<< Updated upstream
<<<<<<< HEAD
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
=======
 * Same as endpoints.user .
 *
 * [] 実装済み
>>>>>>> main
=======
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
>>>>>>> Stashed changes
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * - statuses:
 *   - 200: ok.
 *     - body: User
 *   - 400: not found.
 *   - 500: internal error.
<<<<<<< Updated upstream
<<<<<<< HEAD
=======
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
>>>>>>> main
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< HEAD
 * [v] 実装済み
 * DELETE -> delete match.
 * - statuses:
 *   - 204: deleted.
 *   - 401: unauthorized.
 *   - 404: you haven't matched the target user. 
 *          (not implemented at server) 
=======
 * [] 実装済み
 * DELETE -> delete match.
 * - statuses:
 *   - 204: deleted.
 *   - 404: you haven't matched the target user.
>>>>>>> main
=======
 * [v] 実装済み
 * DELETE -> delete match.
 * - statuses:
 *   - 204: deleted.
 *   - 401: unauthorized.
 *   - 404: you haven't matched the target user. 
 *          (not implemented at server) 
>>>>>>> Stashed changes
 *   - 500: internal error.
 **/
const match = (opponentID: UserID) => {
  return `${origin}/matches/${opponentID}`;
};

/**
<<<<<<< Updated upstream
<<<<<<< HEAD
 * [v] 実装済み
 * GET -> list all matches.
 * - statuses:
 *   - 200: ok.
 *     - body: Relationship[] where relation.status === "MATCHED"
 *            // shouldn't it be User[]?
 *   - 401: unauthorized.
=======
 * [] 実装済み
 * GET -> list all matches.
 * - statuses:
 *   - 200: ok.
 *     - body: User[] // TODO: reconsider this
>>>>>>> main
=======
 * [v] 実装済み
 * GET -> list all matches.
 * - statuses:
 *   - 200: ok.
 *     - body: Relationship[] where relation.status === "MATCHED"
 *            // shouldn't it be User[]?
 *   - 401: unauthorized.
>>>>>>> Stashed changes
 *   - 500: internal error.
 **/
const matches = `${origin}/matches`;

<<<<<<< Updated upstream
<<<<<<< HEAD

/**
 * [x] 実装済み
 * GET -> list all requests that are sent to you and not accepted yet.
 * - statuses:
 *   - 200: ok.
 *     - body: Relationship[] where relation.status === "PENDING"
 *   - 401: unauthorized.
=======
=======

>>>>>>> Stashed changes
/**
 * [x] 実装済み
 * GET -> list all requests that are sent to you and not accepted yet.
 * - statuses:
 *   - 200: ok.
<<<<<<< Updated upstream
 *     - body: User[] // TODO: reconsider this
>>>>>>> main
=======
 *     - body: Relationship[] where relation.status === "PENDING"
 *   - 401: unauthorized.
>>>>>>> Stashed changes
 *   - 500: internal error.
 **/
const requests = `${origin}/requests`;

/**
<<<<<<< Updated upstream
<<<<<<< HEAD
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
=======
 * [] 実装済み
=======
 * [v] 実装済み
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
const request = (receiverId: UserID) => {
  return `${origin}/requests/${receiverId}`;
>>>>>>> main
=======
const request = (opponentId: UserID) => {
  return `${origin}/requests/${opponentId}`;
>>>>>>> Stashed changes
};

export default {
  user,
  userByGUID,
  userExists,
  users,
<<<<<<< Updated upstream
<<<<<<< HEAD
  matchedUsers,
  pendingUsers,
=======
>>>>>>> main
=======
  matchedUsers,
  pendingUsers,
>>>>>>> Stashed changes
  match,
  matches,
  requests,
  request,
};
