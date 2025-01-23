import Link from "next/link";
import { MdInfoOutline } from "react-icons/md";
import { CourseMateIcon } from "./common/CourseMateIcon";

type Props = {
  title?: string;
};

export default function Header(props: Props) {
  const { title } = props;
  return (
    <header className="relative flex h-12 w-full items-center justify-center border-gray-200 border-b">
      {title && (
        <Link
          href="/home"
          passHref
          className="-translate-y-1/2 absolute top-1/2 left-3 transform"
        >
          <CourseMateIcon width="30px" height="30px" />
        </Link>
      )}

      {title ? (
        <h1 className="w-full flex-grow text-center text-black text-xl">
          {title}
        </h1>
      ) : (
        <CourseMateIcon width="30px" height="30px" />
      )}
      <Link
        href="/faq"
        passHref
        className="-translate-y-1/2 absolute top-1/2 right-3 transform"
      >
        <MdInfoOutline size={28} className="text-gray-500" />
      </Link>
    </header>
  );
}
