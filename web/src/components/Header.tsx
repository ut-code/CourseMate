"use client";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { CourseMateIcon } from "./common/CourseMateIcon";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
};

export default function Header(props: Props) {
  const { title } = props;
  const router = useRouter();
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "secondary.main",
          boxShadow: "2px 2px 4px -2px gray",
        }}
      >
        <Toolbar>
          <Box sx={{ marginRight: "8px" }}>
            <IconButton
              onClick={() => {
                router.push("/home");
              }}
            >
              <CourseMateIcon width="28px" height="28px" />
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ flexGrow: 1, color: "#000000" }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={() => router.push("/faq")}
            sx={{ zIndex: "100" }}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
