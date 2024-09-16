import { createContext } from "react";
import { AlertContextType } from "./AlertProvider";

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined,
);
