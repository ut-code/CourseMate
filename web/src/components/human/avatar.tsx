import { AvatarWithFallback } from "./WithFallback";

type Props = {
  pictureUrl?: string;
  width: string;
  height: string;
};

export function UserAvatar({ pictureUrl, width, height }: Props) {
  return <AvatarWithFallback url={pictureUrl} width={width} height={height} />;
}

export default UserAvatar;
