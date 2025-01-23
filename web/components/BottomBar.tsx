import Link from "next/link";
import {
  MdHome,
  MdOutlineChat,
  MdOutlinePersonSearch,
  MdOutlineSettings,
  MdPeopleOutline,
  MdPersonSearch,
} from "react-icons/md";
import { MdPeople } from "react-icons/md";
import { MdChat } from "react-icons/md";
import { MdSettings } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";

type Props = {
  activeTab: "0_home" | "1_friends" | "2_search" | "3_chat" | "4_settings";
};

function BottomBarCell({
  href,
  iconComponent,
}: {
  href: string;
  iconComponent: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-1 justify-center py-3 text-primary focus:bg-gray-300"
    >
      {iconComponent}
    </Link>
  );
}

export default function BottomBar(props: Props) {
  const { activeTab } = props;
  return (
    <div className="fixed bottom-0 z-30 flex h-12 w-full flex-row items-center justify-around border-gray-200 border-t bg-white">
      <BottomBarCell
        href="/home"
        iconComponent={
          activeTab === "0_home" ? (
            <MdHome className="text-3xl" />
          ) : (
            <MdOutlineHome className="text-3xl" />
          )
        }
      />
      <BottomBarCell
        href="/friends"
        iconComponent={
          activeTab === "1_friends" ? (
            <MdPeople className="text-3xl" />
          ) : (
            <MdPeopleOutline className="text-3xl" />
          )
        }
      />
      <BottomBarCell
        href="/search"
        iconComponent={
          activeTab === "2_search" ? (
            <MdPersonSearch className="text-3xl" />
          ) : (
            <MdOutlinePersonSearch className="text-3xl " />
          )
        }
      />
      <BottomBarCell
        href="/chat"
        iconComponent={
          activeTab === "3_chat" ? (
            <MdChat className="text-3xl" />
          ) : (
            <MdOutlineChat className="text-3xl" />
          )
        }
      />
      <BottomBarCell
        href="/settings"
        iconComponent={
          activeTab === "4_settings" ? (
            <MdSettings className="text-3xl" />
          ) : (
            <MdOutlineSettings className="text-3xl" />
          )
        }
      />
    </div>
  );
}
