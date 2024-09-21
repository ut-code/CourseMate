import { Box } from "@mui/material";
import MyReq from "./myRequests";
import OthersReq from "./othersRequests";

export default function Requests() {
  return (
    <Box>
      <OthersReq />
      <MyReq />
    </Box>
  );
}
