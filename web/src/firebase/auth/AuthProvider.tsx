import { getAuth, onAuthStateChanged } from "firebase/auth";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import * as userAPI from "../../api/user";
import type { GUID, User } from "../../common/types";

const AuthContext = createContext<User | null | undefined>(undefined);

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
          userAPI
            .getByGUID(firebaseUser.uid as GUID)
            .then((user) => setUser(user.data));
        } else {
          setUser(null);
        }
      });
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  useContext(AuthContext);
}
