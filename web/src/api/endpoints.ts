const origin = import.meta.env.VITE_API_ENDPOINT;
type UserID = number;

const user = (userId: UserID) => `${origin}/users/${userId}`;

const singlematch = (senderId: UserID, receiverId: UserID) => `${origin}/match/${senderId}/${receiverId}`;

const matches = (userId: UserID) => `${origin}/requests/matched/${userId}`;

const requests = (userId: UserID) => `${origin}/requests/receiverId/${userId}`;

export default {
  user,
  singlematch,
  matches,
  requests,
};
