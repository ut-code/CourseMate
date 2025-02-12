"use client";

import Link from "next/link";
import { MdChevronRight } from "react-icons/md";
import LogOutButton from "~/components/LogOutButton";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

function Item({
  href,
  title,
}: {
  href: string;
  title: string;
}) {
  return (
    <li>
      <Link href={href} className="btn cm-li-btn">
        <div className="flex w-full items-center justify-between">
          <span>{title}</span>
          <MdChevronRight className="text-2xl" />
        </div>
      </Link>
    </li>
  );
}

export default function Settings() {
  useSetHeaderFooter({ title: "設定" }, { activeTab: "4_settings" });
  return (
    <div className="flex flex-col justify-start">
      <h2 className="p-4 pb-2 text-gray-500 text-xs">基本情報</h2>
      <ul className="w-full">
        <Item href="/settings/profile" title="プロフィール" />
        <Item href="/settings/courses" title="授業" />
        <Item href="/settings/interests" title="興味分野" />
        <Item href="/settings/card" title="カードのプレビュー" />
      </ul>
      <h2 className="p-4 py-2 text-gray-500 text-xs">その他</h2>
      <ul className="w-full">
        <Item href="/tutorial" title="CourseMateの使い方" />
        <Item href="/settings/notification" title="運営からのお知らせ" />
        <Item href="/settings/contact" title="お問い合わせ" />
        <Item href="/faq" title="よくあるご質問" />
        <Item href="/settings/aboutUs" title="About Us" />
        <Item href="/settings/disclaimer" title="免責事項" />
        <Item href="/settings/delete" title="アカウント削除" />
        <li>
          <LogOutButton />
        </li>
      </ul>
    </div>
  );
}
