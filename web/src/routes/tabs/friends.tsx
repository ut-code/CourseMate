import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Requests from "../../components/match/requests";
import Matchings from "../../components/match/matching";

export function Friends() {
  const [open, setOpen] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newOpen: number) => {
    setOpen(newOpen);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={open} onChange={handleChange} sx={{ width: "100%" }}>
          <Tab label="マッチ中" {...a11yProps(0)} sx={{ width: "50%" }} />
          <Tab label="リクエスト" {...a11yProps(1)} sx={{ width: "50%" }} />
        </Tabs>
      </Box>
      <TabPanel open={open}>
        {open === 0 ? <Matchings /> : open === 1 ? <Requests /> : null}
      </TabPanel>
    </>
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
      role="tabpanel"
      id={`tabpanel-${open}`}
      aria-labelledby={`tab-${open}`}
    >
      <Box>{children}</Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}
