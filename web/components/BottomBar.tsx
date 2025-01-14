import Link from "next/link";
import { MdHome } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdChat } from "react-icons/md";
import { MdSettings } from "react-icons/md";
import { MdSearch } from "react-icons/md";

type Props = {
  activeTab: "0_home" | "1_friends" | "2_search" | "3_chat" | "4_settings";
};

function BottomBarCell({
  href,
  iconComponent,
  isActive,
}: {
  href: string;
  iconComponent: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 justify-center py-3 focus:bg-gray-300 ${
        isActive ? "active text-primary" : "text-secondary"
      }`}
    >
      {iconComponent}
    </Link>
  );
}

export default function BottomBar(props: Props) {
  const { activeTab } = props;
  return (
    <div className="flex w-full flex-row items-center justify-around ">
      <BottomBarCell
        href="/home"
        isActive={activeTab === "0_home"}
        iconComponent={<MdHome className="text-2xl" />}
      />
      <BottomBarCell
        href="/friends"
        isActive={activeTab === "1_friends"}
        iconComponent={<MdPeople className="text-2xl" />}
      />
      <BottomBarCell
        href="/search"
        isActive={activeTab === "2_search"}
        iconComponent={<MdSearch className="text-2xl" />}
      />
      <BottomBarCell
        href="/chat"
        isActive={activeTab === "3_chat"}
        iconComponent={<MdChat className="text-2xl" />}
      />
      <BottomBarCell
        href="/settings"
        isActive={activeTab === "4_settings"}
        iconComponent={<MdSettings className="text-2xl" />}
      />
    </div>
  );
}
