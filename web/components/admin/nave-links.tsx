"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdHome } from "react-icons/md";
import { MdNotificationsNone } from "react-icons/md";
import { MdSupervisedUserCircle } from "react-icons/md";
import { MdQuestionMark } from "react-icons/md";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "ホーム", href: "/admin", icon: MdHome },
  {
    name: "ユーザー一覧",
    href: "/admin/users",
    icon: MdSupervisedUserCircle,
  },
  {
    name: "お知らせ配信",
    href: "/admin/notification",
    icon: MdNotificationsNone,
  },
  {
    name: "お問い合わせ",
    href: "/admin/question",
    icon: MdQuestionMark,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 font-medium text-sm hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
