"use client";

import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useAboutMe } from "../../../api/user";
import { Card } from "../../../components/Card";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "../../../components/common/NavigateByAuthState";
import TopNavigation from "../../../components/common/TopNavigation";

export default function SettingsProfile() {
  const { state } = useAboutMe();
  const data = state.data;
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";
  const [back, setBack] = useState<boolean>(false);

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      {loading ? (
        <FullScreenCircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : !data ? (
        <Typography>データがありません。</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "8px",
          }}
        >
          <TopNavigation title="あなたのカード" />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                LinkComponent={Link}
                href={back ? "/edit/courses" : "/edit/profile"}
                startIcon={<EditIcon />}
                sx={{
                  paddingRight: "0px",
                  // (画面幅 - カード幅) / 2 - profile の padding
                  marginRight:
                    "calc(calc(calc(100vw - min(40dvh, 87.5vw)) / 2) - 8px)",
                }}
              >
                編集する
              </Button>
            </Box>
            <Card displayedUser={data} onFlip={(back) => setBack(back)} />
          </Box>
        </Box>
      )}
    </NavigateByAuthState>
  );
}
