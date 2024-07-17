const origin = import.meta.env.VITE_API_ENDPOINT;
type UserID = number;

const user = (userId: UserID) => {
  return `${origin}/users/${userId}`;
};

const alluser = `${origin}/users/all`;

const userByGUID = (guid: string) => {
  return `${origin}/users/by-guid/${guid}`;
}

// this one may be public to anyone.
const userExists = (guid: string) => {
  return `${origin}/users/exists/${guid}`;
};

const singlematch = (senderId: UserID, receiverId: UserID) => {
  return `${origin}/match/${senderId}/${receiverId}`;
};

const matches = `${origin}/requests/matched`;

const requests = `${origin}/requests`;

const sendRequest = (receiverId: UserID) => {
  return `${import.meta.env.VITE_API_ENDPOINT}/requests/send/${receiverId}`;
};

const acceptRequest = (senderId: UserID) => {
  return `${origin}/requests/accept/${senderId}`;
}

const rejectRequest = (senderId: UserID, receiverId: UserID) => {
  return `${origin}/requests/reject/${senderId.toString()}/${receiverId.toString()}`
}


export default {
  user,
  userByGUID,
  userExists,
  alluser,
  singlematch,
  matches,
  requests,
  sendRequest,
  acceptRequest,
  rejectRequest,
};
