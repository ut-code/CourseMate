import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function EditPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="flex h-screen flex-col">
        <Header title="編集/Edit" />
        <div className="mt-14 flex-1 sm:mt-16">{children}</div>
      </div>
    </NavigateByAuthState>
  );
}
