import Link from "next/link";
import { MdHome } from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdChat } from "react-icons/md";
import { MdSettings } from "react-icons/md";
import { MdSearch } from "react-icons/md";

type Props = {
  activeTab: "0_home" | "1_friends" | "2_chat" | "3_settings" | "4_search";
};

function BottomBarCell({
  label,
  href,
  iconComponent,
  isActive,
}: {
  label: string;
  href: string;
  iconComponent: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`focus:bg-gray-300 ${isActive ? "active text-primary" : "text-secondary"}`}
    >
      {iconComponent}
      <span
        className={`text-xs ${isActive ? "text-primary" : "text-gray-500"}`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function BottomBar(props: Props) {
  const { activeTab } = props;
  return (
    <div className="btm-nav flex max-h-14 w-full flex-row">
      <BottomBarCell
        label="Home"
        href="/home"
        isActive={activeTab === "0_home"}
        iconComponent={<MdHome className="text-2xl" />}
      />
      <BottomBarCell
        label="Friends"
        href="/friends"
        isActive={activeTab === "1_friends"}
        iconComponent={<MdPeople className="text-2xl" />}
      />
      <BottomBarCell
        label="Chat"
        href="/chat"
        isActive={activeTab === "2_chat"}
        iconComponent={<MdChat className="text-2xl" />}
      />
      <BottomBarCell
        label="Settings"
        href="/settings"
        isActive={activeTab === "3_settings"}
        iconComponent={<MdSettings className="text-2xl" />}
      />
      <BottomBarCell
        label="Search"
        href="/search"
        isActive={activeTab === "4_search"}
        iconComponent={<MdSearch className="text-2xl" />}
      />
    </div>
  );
}
