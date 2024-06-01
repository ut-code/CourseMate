import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
}

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
      const response = await fetch(`http://localhost:3000/users/${uid}`);
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
          router.replace("/login");
          console.log("リダイレクトしました。");
        }
      });
    } catch (error) {
      setUser(null);
      router.replace("/login");
      console.log("ログイン時にエラー出ました。");
      throw error;
    }
  }, [router]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
