import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <EmojiEmotionsIcon style={{ color: "#000000" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#000000" }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
