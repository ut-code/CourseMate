import { createContext } from "react";
import type { User } from "../../common/types";

export const AuthContext = createContext<User | null | undefined>(undefined);
