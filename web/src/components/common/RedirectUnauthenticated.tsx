import { getAuth, onAuthStateChanged } from "firebase/auth";
import { type ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import FullScreenCircularProgress from "./FullScreenCircularProgress";

/**
 * Google アカウントでログインしていなければ Login にリダイレクト
 */
export function RedirectUnauthenticated({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, [auth]);

  if (isAuthenticated === null) {
    return <FullScreenCircularProgress />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
