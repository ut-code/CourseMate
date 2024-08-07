type Props = {
  pictureUrl?: string;
  altText?: string;
  width?: string;
  height?: string;
};

const UserAvatar = ({ pictureUrl, altText, width, height }: Props) => {
  return pictureUrl ? (
    <img
      src={pictureUrl}
      alt={altText}
      style={{ width, height, objectFit: "cover", borderRadius: "50%" }}
    />
  ) : null;
};

export default UserAvatar;
