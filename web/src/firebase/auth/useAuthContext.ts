import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuthContext = () => useContext(AuthContext);
