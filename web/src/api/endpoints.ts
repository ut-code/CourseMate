type UserID = number;
const user = (userId: UserID) => `{import.meta.env.VITE_API_ENDPOINT}/users/${userId}`;

const matched = (userId: UserID) => `{import.meta.env.VITE_API_ENDPOINT}/requests/matched/${userId}`;

const requests = (userId: UserID) => `${import.meta.env.VITE_API_ENDPOINT}/requests/receiverId/${userId}`;

export default {
  user,
  matched,
  requests,
};
