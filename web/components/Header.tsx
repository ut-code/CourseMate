import Link from "next/link";
import { MdInfoOutline } from "react-icons/md";
import { CourseMateIcon } from "./common/CourseMateIcon";

type Props = {
  title?: string;
  info?: boolean;
};

export default function Header(props: Props) {
  const { title } = props;
  return (
    <header className="fixed top-0 z-30 flex h-12 w-full items-center justify-center border-gray-200 border-b bg-white">
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
      <div className="dropdown dropdown-end -translate-y-1/2 absolute top-1/2 right-3 transform">
        <button tabIndex={0} className="btn btn-ghost btn-circle" type="button">
          <MdInfoOutline size={28} className="text-gray-500" />
        </button>
        <div className="dropdown-content z-[1] w-56 rounded-box bg-base-100 p-2 shadow">
          <p className="p-2 text-xs">CourseMate は現在ベータ版です。</p>
          {/* biome-ignore lint/a11y/noNoninteractiveTabindex: daisyUI の仕様。tabIndex を消すとモバイルで開かないなどの問題が起こる */}
          <ul tabIndex={0} className="menu p-0">
            <li>
              <a
                href="https://forms.gle/WvFTbsJoHjGp9Qt88"
                target="_blank"
                rel="noreferrer"
              >
                ご意見・バグ報告
              </a>
            </li>
            {/* <li
              <a>開発に参加する</a>
            </li> */}
            <li>
              <Link href="/faq" passHref>
                よくある質問
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
