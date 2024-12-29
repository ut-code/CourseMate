import type { UserID } from "common/types";
import * as endpoints from "./internal/endpoints";
import { uploadImage as uploader } from "./internal/fetch-func";
export { MAX_IMAGE_SIZE } from "./internal/fetch-func";

export async function uploadAvatar(f: File) {
  return await uploader(endpoints.profilePicture, f);
}

/** @throws if failed to send image. **/
export async function sendImageTo(u: UserID, f: File) {
  console.log("sendImageTo");
  await uploader(endpoints.sendPictureTo(u), f);
}
