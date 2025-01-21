import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function FriendsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="フレンド/Friends" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="grow overflow-y-auto">{children}</div>
      </NavigateByAuthState>
      <BottomBar activeTab="1_friends" />
    </>
  );
}
