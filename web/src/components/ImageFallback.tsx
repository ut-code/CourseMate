import { useEffect, useState } from "react";

type Props = {
  url?: string;
  fallback: React.ReactElement;
  width: string;
  height: string;
};

// https://medium.com/@abhishekmicosoft/handling-img-fallback-307653b2f30
export function ImageFallback({ width, height, url, fallback }: Props) {
  const [ok, setOK] = useState<boolean>(true);
  useEffect(() => {
    url;
    setOK(true);
  }, [url]);
  const URL = url?.startsWith("/")
    ? `${import.meta.env.VITE_API_ENDPOINT}${url}`
    : url;

  return ok ? (
    <object
      data={URL}
      type="image/webp"
      width={width} // there probably prevent style shaking
      height={height}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    >
      <img
        src="/avatar-fallback.webp"
        width={width}
        height={height}
        style={{ width, height }}
        alt=""
      />
    </object>
  ) : (
    <>{fallback}</>
  );
}
