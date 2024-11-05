"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { userExists } from "../../api/internal/endpoints";
import FullScreenCircularProgress from "./FullScreenCircularProgress";

/**
 * ログイン状態によって特定のパスに遷移させる。
 * @param type
 * `toLoginForUnauthenticated` : 未ログインなら `/login` に遷移させる。
 * `toHomeForAuthenticated` : ログイン済なら `/home` に遷移させる。
 */
export function NavigateByAuthState({
  type,
  children,
}: {
  type: "toLoginForUnauthenticated" | "toHomeForAuthenticated";
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return void setIsAuthenticated(false);
      const guid = getAuth().currentUser?.uid;
      if (!guid) return void setIsAuthenticated(false);
      const res = await fetch(userExists(guid));
      const exists = res.status === 200;
      setIsAuthenticated(exists);
    });
    return unsubscribe;
  }, []);

  if (isAuthenticated === null) {
    return <FullScreenCircularProgress />;
  }

  if (type === "toHomeForAuthenticated") {
    if (isAuthenticated) {
      router.push("/home");
    } else {
      return children;
    }
  } else {
    if (isAuthenticated) {
      return children;
    }
    router.push("/login");
  }
}
