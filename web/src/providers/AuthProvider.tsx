import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { User } from "../../../common/types";
import { redirect } from "react-router-dom";

const AuthContext = createContext<User | null | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
//   const navigate = useNavigate();

  /**
   * Google アカウントの uid を用いて CourseMate ユーザの情報を取得する。
   * @param uid Google アカウントの uid
   * @returns ユーザの情報
   */
  async function getUserData(uid: string): Promise<User> {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/${uid}`);
      if (response.status === 404) {
        console.log("データがありません。");
        redirect("/login")
      }
      const data = await response.json();
      return data;
  }

  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          getUserData(firebaseUser.uid).then((user) => setUser(user));
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
