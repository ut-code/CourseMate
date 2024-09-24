import { getAuth } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "../config";

//画像をfirebase storageにアップロードする関数
export async function uploadImage(pictureFile: File): Promise<string> {
  const guid = getAuth().currentUser?.uid;
  if (!guid) throw new Error("Failed to get user");

  const storage = getStorage(app);
  const filePath = `${guid}/${pictureFile.name}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, pictureFile);
    const pictureUrl = await getDownloadURL(snapshot.ref);
    return pictureUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("画像のアップロードに失敗しました");
  }
}

//画像をfirebase storageにアップロードする関数
export async function deleteImage(desertFileUrl: string) {
  const storage = getStorage(app);
  const desertRef = ref(storage, desertFileUrl);

  try {
    await deleteObject(desertRef);
  } catch (e) {
    console.error("Error deleting file:", e);
    throw new Error("既存の画像の削除に失敗しました");
  }
}
