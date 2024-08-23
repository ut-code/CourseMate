import { useState, ChangeEvent, useEffect } from "react";
import { uploadImage } from "../firebase/store/upload-photo";
import { photo } from "./data/photo-preview";
import { ImageCropper } from "./ImageCropper";

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
      <input type="file" onChange={handleImageChange} />
    </>
  );
}
