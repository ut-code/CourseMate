import BottomBar from "~/components/BottomBar";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { ModalProvider } from "~/components/common/modal/ModalProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ModalProvider>
        <Header title="フレンド" />
        <NavigateByAuthState type="toLoginForUnauthenticated">
          <div className="cm-pb-footer h-full overflow-y-auto pt-12">
            {children}
          </div>
        </NavigateByAuthState>
        <BottomBar activeTab="1_friends" />
      </ModalProvider>
    </>
  );
}
