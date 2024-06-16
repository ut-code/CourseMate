import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { User } from "../types";

const AuthContext = createContext<User | null | undefined>(undefined);

export default function AuthProvider({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: any; // FIXME: any
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  async function getUserData(uid: string): Promise<User> {
    try {
      const response = await fetch(`http://localhost:3000/users/${uid}`);
      if (response.status === 404) {
        navigation.navigate("Login");
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
          navigation.navigate("Login");
          console.log("リダイレクトしました。");
        }
      });
    } catch (error) {
      setUser(null);
      navigation.navitate("Login");
      console.log("ログイン時にエラー出ました。");
      throw error;
    }
  }, [navigation]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
