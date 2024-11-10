import Link from "next/link";
import LogOutButton from "~/components/LogOutButton";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Settings() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex flex-col items-center justify-start">
        <ul className="w-full">
          <li>
            <Link href="/settings/profile" className="btn cm-li-btn">
              あなたのカード
            </Link>
          </li>
          <hr />
          <li>
            <Link href="/tutorial" className="btn cm-li-btn">
              CourseMateの使い方
            </Link>
          </li>
          <hr />
          <li>
            <Link href="/settings/contact" className="btn cm-li-btn">
              お問い合わせ
            </Link>
          </li>
          <hr />
          <li>
            <Link href="/faq" className="btn cm-li-btn">
              よくある質問
            </Link>
          </li>
          <hr />
          <li>
            <Link href="/settings/aboutUs" className="btn cm-li-btn">
              About Us
            </Link>
          </li>
          <hr />
          <li>
            <Link href="/settings/disclaimer" className="btn cm-li-btn">
              免責事項
            </Link>
          </li>
          <hr />
          <li>
            <Link href="/settings/delete" className="btn cm-li-btn">
              アカウント削除
            </Link>
          </li>
          <hr />
          <li>
            <LogOutButton />
          </li>
          <hr />
        </ul>
      </div>
    </NavigateByAuthState>
  );
}
