import Link from "next/link";
import { MdArrowBackIosNew, MdInfoOutline } from "react-icons/md";
import { CourseMateIcon } from "./common/CourseMateIcon";

export type TopBarProps = {
  title?: string;
  info?: boolean;
  backButtonPath?: string;
};

export default function TopBar(props: TopBarProps) {
  const { title, info, backButtonPath } = props;

  return (
    <header className="fixed top-0 z-30 flex h-12 w-full items-center justify-center border-gray-200 border-b bg-white">
      {title &&
        (!backButtonPath ? (
          <Link
            href="/home"
            passHref
            className="-translate-y-1/2 absolute top-1/2 left-3 transform"
          >
            <CourseMateIcon width="30px" height="30px" />
          </Link>
        ) : (
          <Link
            href={backButtonPath}
            passHref
            className="-translate-y-1/2 absolute top-1/2 left-3 transform"
          >
            <MdArrowBackIosNew size={24} className="text-black" />
          </Link>
        ))}

      {title ? (
        <h1 className="w-full flex-grow text-center text-black text-xl">
          {title}
        </h1>
      ) : (
        <CourseMateIcon width="30px" height="30px" />
      )}
      {info && (
        <Link
          href="/faq"
          passHref
          className="-translate-y-1/2 absolute top-1/2 right-3 transform"
        >
          <MdInfoOutline size={28} className="text-gray-500" />
        </Link>
      )}
    </header>
  );
}
