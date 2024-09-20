import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Followers from "../../components/match/followers";
import Requests from "../../components/match/requests";

export function Friends() {
  const [open, setOpen] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newOpen: number) => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={open} onChange={handleChange}>
          <Tab label="マッチ中" {...a11yProps(0)} />
          <Tab label="リクエスト" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel open={open}>
        {open === 0 ? <Followers /> : open === 1 ? <Requests /> : null}
      </TabPanel>
    </Box>
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
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
