import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
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

  async function registerNewUser(firebaseUser: any) {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to register new user');
      }

      const newUser = await response.json();
      setUser(newUser);
    } catch (error) {
      console.error('Error registering new user:', error);
    }
  }

  useEffect(() => {
    try {
      const auth = getAuth();
      return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          getUserData(firebaseUser.uid)
            .then((existingUser) => {
              if (existingUser) {
                setUser(existingUser);
              } else {
                registerNewUser(firebaseUser);
              }
            })
            .catch(() => {
              registerNewUser(firebaseUser);
            });
        } else {
          setUser(null);
          router.replace('/login');
          console.log("リダイレクトしました。");
        }
      });
    } catch (error) {
      setUser(null);
      router.replace('/login');
      console.log("ログイン時にエラー出ました。");
    }
  }, [router]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
