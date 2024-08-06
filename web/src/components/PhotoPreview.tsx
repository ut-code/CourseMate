import { useState, ChangeEvent, useEffect } from "react";
import { uploadImage } from "../firebase/store/upload-photo";
import { saver } from "./data/photo-preview";

export function PhotoPreview() {
  const [url, setUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  useEffect(() => {
    if (file) saver.save = async () => await uploadImage(file);
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
      {url && <img className="icon-image-preview" src={url} />}
      <input type="file" onChange={handleImageChange} />
    </>
  );
}
