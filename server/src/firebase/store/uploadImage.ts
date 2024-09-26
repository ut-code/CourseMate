import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "../config";

const storage = getStorage(app);

/**
 * @throws if failed to upload image
 **/
export async function uploadImage(
  path: string,
  file: Uint8Array,
): Promise<string> {
  const storageRef = ref(storage, path);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const pictureUrl = await getDownloadURL(snapshot.ref);
    return pictureUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("画像のアップロードに失敗しました");
  }
}

/**
 * @throws if failed to delete file.
 **/
export async function deleteImage(desertFileUrl: string) {
  const desertRef = ref(storage, desertFileUrl);

  try {
    await deleteObject(desertRef);
  } catch (e) {
    console.error("Error deleting file:", e);
    throw new Error("既存の画像の削除に失敗しました");
  }
}
