import { useEffect, useState } from "react";

type Props = {
  url?: string;
  fallback: React.ReactElement;
  width: string;
  height: string;
  alt: string;
};

// https://medium.com/@abhishekmicosoft/handling-img-fallback-307653b2f30
export function ImageFallback({ width, height, url, fallback, alt }: Props) {
  const [ok, setOK] = useState<boolean>(true);
  useEffect(() => {
    url;
    setOK(true);
  }, [url]);
  const URL = url?.startsWith("/")
    ? `${import.meta.env.VITE_API_ENDPOINT}${url}`
    : url;

  return ok ? (
    <img
      src={URL}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
      onError={() => {
        console.log("failed to fetch image data of:", URL);
        setOK(false);
      }}
      alt={alt}
    />
  ) : (
    <>{fallback}</>
  );
}
