import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebase/firebaseconfig";
import { getAuth } from "firebase/auth";

//画像をfirestoreにアップロードする関数
export async function uploadImage(pictureFile: File): Promise<string> {
  const guid = getAuth().currentUser?.uid;
  if (!guid) throw new Error("Failed to get user");

  const storage = getStorage(app);
  const filePath = `${guid}/${pictureFile.name}`;
  const storageRef = ref(storage, filePath);

  try {
    const snapshot = await uploadBytes(storageRef, pictureFile);
    const pictureUrl = await getDownloadURL(snapshot.ref);
    console.log("File available at", pictureUrl);
    return pictureUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("画像のアップロードに失敗しました");
  }
}
