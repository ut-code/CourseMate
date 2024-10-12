import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAboutMe } from "../../../api/user";
("../../../api/user");
import { Card } from "../../../components/Card";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";
import TopNavigation from "./components/TopNavigation";

export default function Profile() {
  const { state } = useAboutMe();
  const data = state.data;
  const navigate = useNavigate();
  const error = state.current === "error" ? state.error : null;
  const loading = state.current === "loading";
  const [back, setBack] = useState<boolean>(false);

  if (loading) {
    return <FullScreenCircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  if (!data) {
    return <Typography>データがありません。</Typography>;
  }

  return (
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
            onClick={() => navigate(back ? "/edit/courses" : "/edit/profile")}
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
  );
}
