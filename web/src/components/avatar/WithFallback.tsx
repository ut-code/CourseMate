import { ImageFallback } from "../ImageFallback";
import { Avatar } from "@mui/material";

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
      fallback={<Avatar />}
    />
  );
}
