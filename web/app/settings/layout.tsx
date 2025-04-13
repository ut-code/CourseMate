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
      <Header title="設定" />
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="cm-pb-footer h-full overflow-y-auto pt-12">
          {children}
        </div>
      </NavigateByAuthState>
      <BottomBar activeTab="4_settings" />
    </>
  );
}
