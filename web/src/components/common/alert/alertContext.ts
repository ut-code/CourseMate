import { createContext } from "react";
import type { AlertContextType } from "./AlertProvider";

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined,
);
