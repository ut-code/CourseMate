import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { CourseMateIcon } from "./common/CourseMateIcon";

type Props = {
  title: string;
};

export default function Header(props: Props) {
  const { title } = props;
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
            <CourseMateIcon width="28px" height="28px" />
          </Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ flexGrow: 1, color: "#000000" }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
