import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app } from "../firebaseconfig";
import { getAuth } from "firebase/auth";

//画像をfirebase strageにアップロードする関数
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

//画像をfirebase strageにアップロードする関数
export async function deleteImage(desertFileUrl: string) {
  const guid = getAuth().currentUser?.uid;
  if (!guid) throw new Error("Failed to get user");

  const storage = getStorage(app);
  const desertRef = ref(storage, desertFileUrl);

  deleteObject(desertRef)
    .then(() => {
      console.log("過去の画像を削除しました");
    })
    .catch((e) => {
      console.log("過去の画像を削除できなかったです");
      throw e;
    });
}
