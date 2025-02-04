import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="チャット" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="flex-1 overflow-hidden">{children}</div>
      </NavigateByAuthState>
      <BottomBar activeTab="3_chat" />
    </>
  );
}
