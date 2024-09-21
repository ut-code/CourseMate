import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Matchings from "../../components/match/matching";
import Requests from "../../components/match/requests";

export function Friends() {
  const [open, setOpen] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newOpen: number) => {
    setOpen(newOpen);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
          position: "fixed",
          backgroundColor: "white",
          zIndex: 500,
        }}
      >
        <Tabs value={open} onChange={handleChange} variant="fullWidth">
          <Tab label="マッチ中" {...a11yProps(0)} sx={{ width: "50%" }} />
          <Tab label="リクエスト" {...a11yProps(1)} sx={{ width: "50%" }} />
        </Tabs>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "36px",
          left: 0,
          right: 0,
          overflowY: "auto",
        }}
      >
        <TabPanel open={open}>
          {open === 0 ? <Matchings /> : open === 1 ? <Requests /> : null}
        </TabPanel>
      </Box>
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
      // role="tabpanel" // FIXME: biome says it should not be a div, but I couldn't find a proper html elem
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
