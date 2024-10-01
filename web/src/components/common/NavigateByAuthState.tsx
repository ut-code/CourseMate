import { getAuth, onAuthStateChanged } from "firebase/auth";
import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  if (isAuthenticated === null) {
    return <FullScreenCircularProgress />;
  }

  if (type === "toHomeForAuthenticated") {
    return isAuthenticated ? <Navigate to="/home" /> : children;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
}
