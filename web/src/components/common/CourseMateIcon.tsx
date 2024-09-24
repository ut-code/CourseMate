type Props = {
  width: string;
  height: string;
};

export function CourseMateIcon(props: Props) {
  const { width, height } = props;
  return (
    <img
      src="/course-mate-icon.svg"
      alt="アイコン"
      style={{
        width: width,
        height: height,
        objectFit: "cover",
        borderRadius: "50%",
        pointerEvents: "none",
      }}
    />
  );
}
