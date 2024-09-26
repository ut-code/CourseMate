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
    const reset = setInterval(() => {
      setOK((ok) => {
        if (ok) return true;

        console.log(
          "ImageFallback: settings OK to true (this shouldn't happen, fix it if you see this too often)",
        );
        return true;
      });
    }, 500);
    return () => clearInterval(reset);
  }, []);

  return ok ? (
    <img
      src={url}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
      onError={() => setOK(false)}
      alt={alt}
    />
  ) : (
    <>{fallback}</>
  );
}
