"use client";

import { useLayoutEffect } from "react";
import type { BottomBarProps } from "~/components/BottomBar";
import type { TopBarProps } from "~/components/TopBar";
import { useHeaderFooterInternal } from "../components/HeaderFooterContext";

export function useSetHeaderFooter(
  { title, info, useBackButton }: TopBarProps,
  { activeTab }: BottomBarProps,
) {
  const { setHeaderProps, setBottomBarProps } = useHeaderFooterInternal();

  useLayoutEffect(() => {
    setHeaderProps({ title, info, useBackButton });
    setBottomBarProps({ activeTab });
  }, [
    title,
    info,
    useBackButton,
    activeTab,
    setHeaderProps,
    setBottomBarProps,
  ]);
}
