import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { User } from "../../../common/types";
import { redirect } from "react-router-dom";
import userapi from "../api/user";

const AuthContext = createContext<User | null | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          userapi.get(firebaseUser.uid).then((user) => setUser(user));
        } else {
          setUser(null);
          console.log("ログイン画面に移動します");
          redirect("/login")
        }
      });
    } catch (error) {
      setUser(null);
      console.log("エラーが発生しました。ログイン画面に移動します");
      redirect("/login")
      throw error;
    }
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
