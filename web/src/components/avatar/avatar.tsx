type Props = {
  pictureUrl?: string;
  width?: string;
  height?: string;
};

const UserAvatar = ({ pictureUrl, width, height }: Props) => {
  return pictureUrl ? (
    <img
      src={pictureUrl}
      style={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  ) : null;
};

export default UserAvatar;
