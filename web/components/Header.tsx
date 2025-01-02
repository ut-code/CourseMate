import Link from "next/link";
import { MdInfoOutline } from "react-icons/md";
import { CourseMateIcon } from "./common/CourseMateIcon";

type Props = {
  title: string;
};

export default function Header(props: Props) {
  const { title } = props;
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-secondary shadow-md">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/home" passHref>
          <CourseMateIcon width="28px" height="28px" />
        </Link>

        <h1 className="flex-grow text-center font-semibold text-black text-lg">
          {title}
        </h1>

        <Link href="/faq" passHref>
          <MdInfoOutline size={24} />
        </Link>
      </div>
    </header>
  );
}
