"use client";

import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigateByAuthState type="toLoginForUnauthenticated">
        <div className="h-full overflow-y-auto pt-12 pb-12">{children}</div>
      </NavigateByAuthState>
    </>
  );
}
