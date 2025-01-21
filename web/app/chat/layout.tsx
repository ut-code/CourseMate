import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="チャット/Chat" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="flex-1 overflow-hidden">{children}</div>
      </NavigateByAuthState>
      <BottomBar activeTab="3_chat" />
    </>
  );
}
