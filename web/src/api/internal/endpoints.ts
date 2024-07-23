const origin = import.meta.env.VITE_API_ENDPOINT;

// TODO: de-export this and use one from /common
export type UserID = number;

/**
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * PUT -> update user info.
 * DELETE -> delete user.
 **/
const user = (userId: UserID) => {
  return `${origin}/users/id/${userId}`;
};

/**
 * GET -> list all users.
 * POST -> create user.
 **/
const users = `${origin}/users`;

/**
 * Same as endpoints.user .
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * PUT -> update user info.
 * DELETE -> delete user.
 **/
const userByGUID = (guid: string) => {
  return `${origin}/users/guid/${guid}`;
};

// this one may be public to anyone.
/**
 * GET -> check if the user exists.
 **/
const userExists = (guid: string) => {
  return `${origin}/users/exists/${guid}`;
};

/**
 * DELETE -> delete match.
 **/
const match = (opponentID: UserID) => {
  return `${origin}/matches/${opponentID}`;
};

/**
 * GET -> list all matches.
 **/ 
const matches = `${origin}/matches`;

/**
 * GET -> list all users that sent requests to you and the requests are not accepted yet.
 **/
const requests = `${origin}/requests`;

/**
 * POST -> create request.
 * PUT -> accept request.
 * DELETE -> reject request.
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
