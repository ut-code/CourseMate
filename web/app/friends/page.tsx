"use client";

import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import Matchings from "~/components/match/matching";
import Requests from "~/components/match/requests";

export default function Friends() {
  const [open, setOpen] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newOpen: number) => {
    setOpen(newOpen);
  };

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <div className="fixed z-50 w-full border-gray-200 border-b-[1px] bg-white">
        <Tabs value={open} onChange={handleChange} variant="fullWidth">
          <Tab label="マッチ中" {...a11yProps(0)} sx={{ width: "50%" }} />
          <Tab label="リクエスト" {...a11yProps(1)} sx={{ width: "50%" }} />
        </Tabs>
      </div>
      <div className="absolute top-9 right-0 left-0 overflow-y-auto">
        <TabPanel open={open}>
          {open === 0 ? <Matchings /> : open === 1 ? <Requests /> : null}
        </TabPanel>
      </div>
    </NavigateByAuthState>
  );
}

function TabPanel({
  open,
  children,
}: {
  open: number;
  children: React.ReactNode;
}) {
  return (
    <div
      // role="tabpanel" // FIXME: biome says it should not be a div, but I couldn't find a proper html elem
      id={`tabpanel-${open}`}
      aria-labelledby={`tab-${open}`}
    >
      <div>{children}</div>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
