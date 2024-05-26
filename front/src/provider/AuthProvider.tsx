import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

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
        getUserData(firebaseUser!.uid).then((user) => setUser(user));
      });
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
