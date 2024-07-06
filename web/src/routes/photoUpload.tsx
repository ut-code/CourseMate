import { ChangeEvent } from "react";
import { app } from "../firebase/firebaseconfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuthContext } from "../providers/AuthProvider";

export default function PhotoUpload() {
  const user = useAuthContext();
  console.log(user);
  const userId = user?.id;
  console.log("ユーザID" + userId);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    if (!user) {
      console.log("User is not authenticated");
      return;
    }

    const storage = getStorage(app);
    const file = event.target.files[0]; // 選択された画像を取得
    const filePath = `${user.uid}/${file.name}`; // 画像の保存先のpathを指定
    const storageRef = ref(storage, filePath);

    try {
      // ファイルをアップロード
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded a blob or file!", snapshot);
      // アップロードしたファイルのダウンロードURLを取得
      const downloadURL = await getDownloadURL(snapshot.ref);

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pictureUrl: downloadURL }),
        }
      );
      if (!response.ok) {
        console.log(response);
      }
      console.log("File available at", downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      // ここでエラーハンドリング
    }
  };

  return (
    <div>
      <h1>Photo Upload</h1>
      <input type="file" onChange={handleImageChange} />
      <Button
        variant="outlined"
        onClick={async () => {
          try {
            enqueueSnackbar("写真のアップロードに成功しました", {
              variant: "success",
            });
            navigate("/home");
          } catch {
            enqueueSnackbar("写真のアップロードに失敗しました", {
              variant: "error",
            });
          }
        }}
      >
        設定
      </Button>
    </div>
  );
}
