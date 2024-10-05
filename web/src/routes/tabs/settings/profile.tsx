import { ArrowBack } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAboutMe } from "../../../api/user";
("../../../api/user");
import { Card } from "../../../components/Card";
import FullScreenCircularProgress from "../../../components/common/FullScreenCircularProgress";

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
    <>
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}
          onClick={() => {
            navigate("/settings");
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            paddingTop: "30px",
            paddingRight: "30px",
            paddingLeft: "30px",
            position: "relative",
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            あなたのカード
          </Typography>
          <Box
            sx={{
              position: "absolute",
              top: "16px",
              right: "16px",
            }}
          >
            <IconButton
              onClick={() => navigate(back ? "/edit/courses" : "/edit/profile")}
            >
              <EditIcon sx={{ color: "#039BE5" }} fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card displayedUser={data} onFlip={(back) => setBack(back)} />
      </Box>
    </>
  );
}
