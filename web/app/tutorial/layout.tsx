"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSetHeaderFooter({ title: "チュートリアル" }, { activeTab: "none" });
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="h-full overflow-y-auto pt-12">{children}</div>
    </NavigateByAuthState>
  );
}
