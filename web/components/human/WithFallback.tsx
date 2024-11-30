import { ImageFallback } from "../ImageFallback";

type Props = {
  width: string;
  height: string;
  url?: string;
};

export function AvatarWithFallback({ width, height, url }: Props) {
  return (
    <ImageFallback
      width={width}
      height={height}
      url={url}
      fallback={
        <div
          className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200"
          style={{
            width: width,
            height: height,
            objectFit: "cover",
          }}
        />
      }
    />
  );
}
