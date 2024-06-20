import { router } from "expo-router";
import { Platform } from "react-native";
import { ImagePickerResponse } from "react-native-image-picker";

const signUp = async (
  uid: string,
  name: string,
  email: string,
  selfIntro: string,
  sex: string,
  photo: ImagePickerResponse | null, // react-native-image-pickerのレスポンス型を指定
): Promise<void> => {
  console.log("こんにちは");
  try {
    // FormDataを作成
    const formData = new FormData();
    formData.append("uid", uid);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("selfIntro", selfIntro);
    formData.append("sex", sex);

    if (photo && photo.assets && photo.assets.length > 0) {
      const selectedImage = photo.assets[0];

      // プラットフォームごとにURIの調整
      const fileUri =
        Platform.OS === "android"
          ? selectedImage.uri
          : selectedImage.uri!.replace("file://", "");
      const fileName = selectedImage.fileName || "photo.jpg";

      // Blobを作成
      const blob = await uriToBlob(fileUri ?? "");

      formData.append("photo", blob, fileName);
    }

    // ユーザー登録のためのAPIコール
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    const data = await response.json();
    console.log("User registered successfully:", data);
    router.push("/home");
  } catch (error) {
    console.error("Error during sign-up:", error);
    console.log("サインアップに失敗しました");
    router.replace("/");
    console.log("リダイレクトしました。");
  }
};

// URIからBlobを作成する関数
const uriToBlob = async (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error("Failed to convert URI to Blob"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

export default signUp;
