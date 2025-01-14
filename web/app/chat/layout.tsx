import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Header title="チャット/Chat" />
      <div className="grow overflow-y-auto">{children}</div>
      <BottomBar activeTab="3_chat" />
    </NavigateByAuthState>
  );
}
