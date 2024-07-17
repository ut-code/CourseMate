import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { User } from "../../../common/types";
import { API_ENDPOINT } from "../env";
import user from "../api";

const AuthContext = createContext<User | null | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  async function getUserData(uid: string): Promise<User> {
    try {
      const response = await fetch(`${API_ENDPOINT}/users/${uid}`);
      if (response.status === 404) {
        router.push("/");
        console.log("データがありません。");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          getUserData(firebaseUser.uid).then((user) => setUser(user));
        } else {
          setUser(null);
          router.replace("/");
          console.log("リダイレクトしました。");
        }
      });
    } catch (error) {
      setUser(null);
      router.replace("/");
      console.log("ログイン時にエラー出ました。");
      throw error;
    }
  }, [router]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
