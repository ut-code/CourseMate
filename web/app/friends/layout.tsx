import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function FriendsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="フレンド/Friends" />
      <div className="grow overflow-y-auto">{children}</div>
      <BottomBar activeTab="1_friends" />
    </NavigateByAuthState>
  );
}
