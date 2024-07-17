const origin = import.meta.env.VITE_API_ENDPOINT;
type UserID = number;

const user = (userId: UserID) => {
  return `${origin}/users/${userId}`;
};

const singlematch = (senderId: UserID, receiverId: UserID) => {
  return `${origin}/match/${senderId}/${receiverId}`;
};

const matches = (userId: UserID) => {
  return `${origin}/requests/matched/${userId}`;
};

const requests = (userId: UserID) => {
  return `${origin}/requests/receiverId/${userId}`;
};

export default {
  user,
  singlematch,
  matches,
  requests,
};
