import { panic } from "common/lib/panic";
import type { CourseID, Day, GUID } from "common/types";
import type { MessageID, ShareRoomID } from "common/types";

export const API_ENDPOINT: string =
  process.env.NEXT_PUBLIC_API_ENDPOINT ??
  panic("process.env.NEXT_PUBLIC_API_ENDPOINT not found!");

// TODO: de-export this and use one from /common
export type UserID = number;

/**
 * [] 実装済み
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * - statuses:
 *   - 200: ok.
 *     - body: UserWithCoursesAndSubjects
 *   - 400: not found.
 *   - 500: internal error.
 **/
export const user = (userId: UserID) => {
  return `${API_ENDPOINT}/users/id/${userId}`;
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
export const users = `${API_ENDPOINT}/users`;

/**
 * [v] 実装済み
 * GET -> get top N users recommended to me.
 * - statuses:
 *   - 200: good.
 *     - body: UserWithCoursesAndSubjects[]
 *   - 401: auth error.
 *   - 500: internal error
 **/
export const recommendedUsers = `${API_ENDPOINT}/users/recommended`;

/**
 * [v] 実装済み
 * GET -> get info of me.
 * - status:
 *   - 200: ok.
 *   - 401: unauthorized (you are not authenticated).
 *   - 500: internal error.
 *
 * [v] 実装済み
 * PUT -> update user info.
 * - request body: Omit<User, "id">
 * - statuses:
 *   - 200: ok.
 *     - body: UserWithCoursesAndSubjects
 *   - 500: internal error.
 *
 * [v] 実装済み
 * DELETE -> delete user.
 * - statuses:
 *   - 204: deleted, t.f. no content.
 *   - 500: internal error.
 *
 **/
export const me = `${API_ENDPOINT}/users/me`;

/**
 * [v] 実装済み
 * GET -> list all matched users.
 * - statuses:
 *   - 200: ok.
 *     - body: UserWithCoursesAndSubjects[]
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
export const matchedUsers = `${API_ENDPOINT}/users/matched`;

/**
 * [v] 実装済み
 * GET -> list all users that sent request to you.
 * - statuses:
 *   - 200: ok.
 *     - body: UserWithCoursesAndSubjects[]
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
export const pendingRequestsToMe = `${API_ENDPOINT}/users/pending/to-me`;

/**
 * [v] 実装済み
 * GET -> list all users that you sent request.
 * - statuses:
 *   - 200: ok.
 *     - body: UserWithCoursesAndSubjects[]
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
export const pendingRequestsFromMe = `${API_ENDPOINT}/users/pending/from-me`;

/**
 * [v] 実装済み
 * GET -> get user's info. TODO: filter return info by user's options and open level.
 * - statuses:
 *   - 200: ok.
 *     - body: UserWithCoursesAndSubjects
 *   - 400: not found.
 *   - 500: internal error.
 **/
export const userByGUID = (guid: GUID) => {
  return `${API_ENDPOINT}/users/guid/${guid}`;
};

// this one may be public to anyone.
/**
 * [] 実装済み
 * GET -> check if the user exists.
 * - statuses:
 *   - 200: yes, user exists.
 *     - body: UserWithCoursesAndSubjects
 *   - 404: no, user doesn't exist.
 *   - 500: internal error.
 **/
export const userExists = (guid: GUID) => {
  return `${API_ENDPOINT}/users/exists/${guid}`;
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
export const match = (opponentID: UserID) => {
  return `${API_ENDPOINT}/matches/${opponentID}`;
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
export const matches = `${API_ENDPOINT}/matches`;

/**
 * [x] 実装済み
 * GET -> list all requests that are sent to you and not accepted yet.
 * - statuses:
 *   - 200: ok.
 *     - body: Relationship[] where relation.status === "PENDING"
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/

/**
 * [x] 実装済み
 * GET -> get courses the user is enrolled in.
 * - statuses:
 *  - 200: ok.
 *   - body: Course[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 */
export const coursesUserId = (userId: UserID) => {
  return `${API_ENDPOINT}/courses/userId/${userId}`;
};

/**
 * [v] 実装済み
 * GET -> get my courses.
 * - statuses:
 *  - 200: ok.
 *   - body: Course[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 * PATCH → update my courses.
 * - request body: CourseId
 * - statuses:
 *  - 200: ok.
 *   - body: Course[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 * DELETE → delete my courses.
 * - request body: CourseId
 * - statuses:
 *  - 200: ok.
 *   - body: Course[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 */
export const coursesMine = `${API_ENDPOINT}/courses/mine`;

/**
 * [v] 実装済み
 * GET → get courses that overlap with the given course.
 * - statuses:
 *  - 200: ok.
 *    - body: Course[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 */
export const coursesMineOverlaps = (courseId: CourseID) => {
  return `${API_ENDPOINT}/courses/mine/overlaps/${courseId}`;
};

/**
 * [v] 実装済み
 * GET -> courses that exist on the given day and period.
 * - statuses:
 *   - 200: ok.
 *     - body: Course[]
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
export const coursesDayPeriod = (day: Day, period: number) => {
  return `${API_ENDPOINT}/courses/day-period?day=${day}&period=${period}`;
};

/**
 * [v] 実装済み
 * POST -> create a new subject.
 * - statuses:
 *  - 200: ok.
 *   - body: InterestSubject
 *  - 401: unauthorized.
 *  - 500: internal error.
 */
export const subjects = `${API_ENDPOINT}/subjects`;

/**
 * [v] 実装済み
 * GET -> get subjects the user is interested in.
 * - statuses:
 *  - 200: ok.
 *   - body: InterestSubject[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 */
export const subjectsUserId = (userId: UserID) => {
  return `${API_ENDPOINT}/subjects/userId/${userId}`;
};

/**
 * [v] 実装済み
 * GET -> get my subjects.
 * - statuses:
 *  - 200: ok.
 *  - body: InterestSubject[]
 * - 401: unauthorized.
 * - 500: internal error.
 * PATCH -> update my subjects.
 * - request body: SubjectId
 * - statuses:
 * - 200: ok.
 * - body: InterestSubject[]
 * - 401: unauthorized.
 * - 500: internal error.
 * DELETE -> delete my subjects.
 * - request body: SubjectId
 * - statuses:
 * - 200: ok.
 * - body: InterestSubject[]
 * - 401: unauthorized.
 * - 500: internal error.
 * PUT → replace my subjects.
 * - request body: SubjectId[]
 * - statuses:
 * - 200: ok.
 * - body: InterestSubject[]
 * - 401: unauthorized.
 * - 500: internal error.
 */
export const subjectsMine = `${API_ENDPOINT}/subjects/mine`;

/**
 * [v] 実装済み
 * GET -> get all subjects.
 * - statuses:
 *  - 200: ok.
 *   - body: InterestSubject[]
 *  - 401: unauthorized.
 *  - 500: internal error.
 */
export const subjectsAll = `${API_ENDPOINT}/subjects/all`;

/**
 * [v] 実装済み
 * PUT -> create request.
 * - status:
 *   - 201: Created.
 *   - 401: unauthorized.
 *   - 500: internal error.
 **/
export const sendRequest = (opponentId: UserID) => {
  return `${API_ENDPOINT}/requests/send/${opponentId}`;
};

/**
 * PUT -> cancel request that you already sent.
 * - status:
 *   - 204: Successfully
 *   - 401: Unauthorized
 *   - 500: internal error
 **/
export const cancelRequest = (opponentId: UserID) => {
  return `${API_ENDPOINT}/requests/cancel/${opponentId}`;
};
/**
 * [v] 実装済み
 * PUT -> accept request.
 * - status:
 *   - 200: OK.
 *   - 403: (not implemented) Forbidden. he hasn't sent a request to you.
 *   - 500: internal error.
 **/
export const acceptRequest = (opponentId: UserID) => {
  return `${API_ENDPOINT}/requests/accept/${opponentId}`;
};

/**
 * [v] 実装済み
 * PUT -> reject request.
 * - status:
 *   - 204: No content. successfully rejected.
 *   - 401: unauthorized.
 *   - 404: (not implemented) Not found. he hasn't sent a request to you.
 *   - 500: internal error.
 **/
export const rejectRequest = (opponentId: UserID) => {
  return `${API_ENDPOINT}/requests/reject/${opponentId}`;
};

/**
 **/
export const markAsRead = (friendId: UserID, messageId: MessageID) => {
  return `${API_ENDPOINT}/chat/mark-as-read/${friendId}/${messageId}`;
};
/**
 * []実装済み
 * GET -> get personalized room overviews.
 * - status:
 *   - 200: ok
 *     - body=RoomOverview[]
 *   - 401: unauthorized
 *   - 500: internal error
 */
export const roomOverview = `${API_ENDPOINT}/chat/overview`;

/**
 * []実装済み
 * POST -> send a DM.
 * - body: SendMessage
 * - statuses:
 *   - 201: created.
 *     - body: Message
 *   - 401: unauthorized
 *   - 403: Forbidden
 *   - 500: internal error
 **/
export const dmTo = (userId: UserID) => `${API_ENDPOINT}/chat/dm/to/${userId}`;

/**
 * PUT -> start dm with userId. created one if none was found. authorized.
 * - body: {with: UserID}
 * - status:
 *   - 200: room already there.
 *     - body: DMRoom
 *   - 201: created new room.
 *   - 400: bad request: bad param formatting.
 *   - 401: unauthorized.
 *   - 403: forbidden. you and the user are not matched yet.
 *   - 500: internal error.
 **/
export const dmWith = (userId: UserID) =>
  `${API_ENDPOINT}/chat/dm/with/${userId}`;

/**
 * POST -> Create a room. authenticated
 * - body: InitRoom
 * - status:
 *   - 201: created:
 *     - body: SharedRoom
 *   - 401: unauthorized
 *   - 403: forbidden (cannot invite non-friends)
 *   - 500: internal error
 **/
export const sharedRooms = `${API_ENDPOINT}/chat/shared`;

/** authorized
 * GET -> Get info of a room (including the message log).
 * PATCH -> update room info. (excluding the message log).
 * - body: UpdateRoom
 **/
export const sharedRoom = (roomId: ShareRoomID) =>
  `${API_ENDPOINT}/chat/shared/${roomId}`;

/** POST: invite. authorized
 * - body: UserID[]
 * - status:
 *   - 200: Invited. body: SharedRoom
 *   - 401: unauthorized
 *   - 403: forbidden (cannot invite non-friends)
 *   - 500: internal error
 **/
export const roomInvite = (roomId: ShareRoomID) =>
  `${API_ENDPOINT}/chat/shared/id/${roomId}/invite`;

/**
 * PATCH: authorized body=SendMessage
 * DELETE: authorized
 **/
export const message = (messageId: MessageID) =>
  `${API_ENDPOINT}/chat/messages/id/${messageId}`;

/**
 * POST: send picture.
 */
export const sendPictureTo = (friendId: UserID) =>
  `${API_ENDPOINT}/picture/to/${friendId}`;
/**
 * GET: get profile picture of URL (this is usually hard-encoded in pictureURL so this variable is barely used)
 */
export const profilePictureOf = (guid: GUID) =>
  `${API_ENDPOINT}/picture/profile/${guid}`;
export const pictureOf = (guid: GUID) => `${API_ENDPOINT}/picture/${guid}`;

/**
 * POST: update my profile picture.
 */
export const profilePicture = `${API_ENDPOINT}/picture/profile`;

export default {
  user,
  me,
  recommendedUsers,
  userByGUID,
  userExists,
  users,
  matchedUsers,
  pendingRequestsToMe,
  pendingRequestsFromMe,
  match,
  matches,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  coursesUserId,
  coursesDayPeriod,
  subjects,
  subjectsUserId,
  subjectsMine,
  subjectsAll,
  roomOverview,
  dmTo,
  dmWith,
  sharedRoom,
  sharedRooms,
  roomInvite,
  message,
  coursesMine,
  coursesMineOverlaps,
  profilePictureOf,
  profilePicture,
};
