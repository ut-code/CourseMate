import { useState, ChangeEvent, useEffect } from "react";
import { uploadImage } from "../../firebase/store/photo";
import { photo } from "../data/photo-preview";
import { ImageCropper } from "../ImageCropper";
import { Button } from "@mui/material";

const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

type Props = {
  defaultValueUrl?: string;
  onCrop?: (f: File) => void;
};
type ButtonProps = {
  text?: string;
  onSelect: () => void;
};

export function PhotoPreviewButton({ text, onSelect }: ButtonProps) {
  return (
    <Button>
      <label htmlFor="file-upload" className="custom-file-label">
        {text || "写真を選択"}
        <input
          id="file-upload"
          type="file"
          onChange={(e) => {
            onSelect();
            imageSelectHandler(e);
          }}
          accept=".png, .jpeg, .jpg"
          style={{ display: "none" }}
        />
      </label>
    </Button>
  );
}

let imageSelectHandler: (f: ChangeEvent<HTMLInputElement>) => void;

export function PhotoPreview({ defaultValueUrl, onCrop }: Props) {
  // url of original file
  const [url, setUrl] = useState<string | null>(defaultValueUrl || null);
  const [originalFile, setOriginalFile] = useState<File>();
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

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
      setOriginalFile(event.target.files[0]);
    }
  }
  imageSelectHandler = handleImageChange;

  useEffect(() => {
    if (!croppedFile) return;
    photo.upload = async () => await uploadImage(croppedFile);
    if (onCrop) {
      onCrop(croppedFile);
    }
  }, [croppedFile, onCrop]);

  useEffect(() => {
    if (!originalFile) return;
    setCroppedFile(originalFile);

    // src: https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
    // create the preview
    const url = URL.createObjectURL(originalFile);
    setUrl(url);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(url);
  }, [originalFile]);

  return (
    <>
      {url &&
        /* url.startsWith("blob:") <=> url is a(n) url of local file <=> no SOP restriction*/
        url.startsWith("blob:") && (
          <ImageCropper sameOriginURL={url} onImageChange={setCroppedFile} />
        )}
    </>
  );
}
