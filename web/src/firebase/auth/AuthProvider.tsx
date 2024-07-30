import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { redirect } from "react-router-dom";
import userapi from "../../api/user";
import { AuthContext } from "./AuthContext";
import { User } from "../../common/types";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          userapi.getByGUID(firebaseUser.uid).then((user) => setUser(user));
        } else {
          setUser(null);
          console.log("ログイン画面に移動します");
          redirect("/login");
        }
      });
    } catch (error) {
      setUser(null);
      console.log("エラーが発生しました。ログイン画面に移動します");
      redirect("/login");
      throw error;
    }
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
