import { Button } from "@mui/material";
import { type ChangeEvent, useEffect, useState } from "react";
import { uploadImage } from "../../firebase/store/photo";
import { ImageCropper } from "../ImageCropper";
import { photo } from "../data/photo-preview";

const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

type Props = {
  defaultValueUrl?: string;
};
function syncUploaderToFileChange(file: File) {
  if (file) photo.upload = async () => await uploadImage(file);
}
export function PhotoPreview({ defaultValueUrl }: Props) {
  const [url, setUrl] = useState<string | null>(defaultValueUrl || null);
  const [file, setFile] = useState<File | null>(null);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files || event.target.files.length <= 0) {
      return;
    }
    if (event.target.files[0].size > MAX_SIZE_IN_BYTES) {
      alert(
        "ファイルサイズが大きすぎます。5MB以下の画像をアップロードしてください。",
      );
      return;
    }
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  useEffect(() => {
    if (file) photo.upload = async () => await uploadImage(file);
  }, [file]);

  useEffect(() => {
    if (!file) return;

    // src: https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
    // create the preview
    const url = URL.createObjectURL(file);
    setUrl(url);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <>
      {/* url.startsWith("blob:") <=> url is a(n) url of local file <=> no SOP restriction*/}
      {url && url.startsWith("blob:") && (
        <ImageCropper
          sameOriginURL={url}
          onImageChange={syncUploaderToFileChange}
        />
      )}
      <Button>
        <label htmlFor="file-upload" className="custom-file-label">
          写真を選択(必須)
        </label>
      </Button>
      <input
        id="file-upload"
        type="file"
        onChange={handleImageChange}
        accept=".png, .jpeg, .jpg"
        style={{ display: "none" }}
      />
    </>
  );
}
