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
      style={{ width, height, objectFit: "cover" }}
    />
  ) : null;
};

export default UserAvatar;
