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
      <div className="absolute top-14 right-0 bottom-14 left-0 overflow-y-auto sm:top-16">
        {children}
      </div>
      <BottomBar activeTab="2_chat" />
    </NavigateByAuthState>
  );
}
