import { type ReactNode, createContext, useContext, useState } from "react";
import type { BottomBarProps } from "./BottomBar";
import type { TopBarProps } from "./TopBar";

interface HeaderFooterContextType {
  headerProps: TopBarProps;
  setHeaderProps: (props: TopBarProps) => void;
  bottomBarProps: BottomBarProps;
  setBottomBarProps: (props: BottomBarProps) => void;
}

const HeaderFooterContext = createContext<HeaderFooterContextType | undefined>(
  undefined,
);

export const HeaderFooterProvider = ({ children }: { children: ReactNode }) => {
  const [headerProps, setHeaderProps] = useState<TopBarProps>({});
  const [bottomBarProps, setBottomBarProps] = useState<BottomBarProps>({
    activeTab: "0_home",
  });

  return (
    <HeaderFooterContext.Provider
      value={{ headerProps, setHeaderProps, bottomBarProps, setBottomBarProps }}
    >
      {children}
    </HeaderFooterContext.Provider>
  );
};

export const useHeaderFooterInternal = () => {
  const context = useContext(HeaderFooterContext);
  if (!context) {
    throw new Error(
      "useHeaderFooter must be used within a HeaderFooterProvider",
    );
  }
  return context;
};
