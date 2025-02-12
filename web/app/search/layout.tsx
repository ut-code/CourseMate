"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { useSetHeaderFooter } from "~/hooks/useLayoutHeaderFooter";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSetHeaderFooter({ title: "検索" }, { activeTab: "2_search" });
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="h-full overflow-y-auto pt-12 pb-12">{children}</div>
    </NavigateByAuthState>
  );
}
