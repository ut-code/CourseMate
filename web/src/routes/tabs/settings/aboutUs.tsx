import { GitHub, Language } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import { Box, Link, Typography } from "@mui/material";
import TopNavigation from "./components/TopNavigation";

export default function AboutUs() {
  return (
    <Box
      sx={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <TopNavigation title="About Us" />
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "left", textDecoration: "underline" }}
        >
          CourseMateについて
        </Typography>
        <Typography sx={{ mb: "24px", lineHeight: "1.6", textAlign: "left" }}>
          大学の授業を受けている際に、一緒に受ける友達がいなくて困ったことはありませんか？
          「友達がいないから授業をサボるようになってしまった」、「過去問を共有してくれる人がいない」
          などの東大生の悩みを解決したいと思い、CourseMateは開発されました。CourseMateを使うことで
          みなさまの大学生活がより良くなれば幸いです。ぜひ知り合いの方々に広めていただければと思っています。
        </Typography>

        <Box sx={{ mt: "20px", mb: "20px" }}>
          <Link
            href="https://github.com/ut-code/CourseMate"
            target="_blank"
            sx={{
              display: "flex",
              mb: "16px",
              textDecoration: "none",
              color: "inherit",
              "&:hover": { color: "#000000" },
            }}
          >
            <GitHub sx={{ mr: "8px" }} /> CourseMate の GitHub
          </Link>
          <Link
            href="https://x.com/course_mate"
            target="_blank"
            sx={{
              display: "flex",
              textDecoration: "none",
              color: "inherit",
              "&:hover": { color: "#000000" },
            }}
          >
            <XIcon sx={{ mr: "8px" }} /> CourseMate の X (旧 Twitter)
          </Link>
        </Box>

        <Typography
          variant="h6"
          gutterBottom
          sx={{ textAlign: "left", textDecoration: "underline" }}
        >
          ut.code();について
        </Typography>
        <Typography sx={{ mb: "24px", lineHeight: "1.6", textAlign: "left" }}>
          ut.code();は、2019年設立の東京大学のソフトウェアエンジニアリングコミュニティです。
          「学習」、「交流」、「開発」の三つを活動の軸としており、さまざまなアプリを開発しています。
        </Typography>

        <Box sx={{ mt: "20px" }}>
          <Link
            href="https://utcode.net"
            target="_blank"
            sx={{
              display: "flex",
              mb: "16px",
              textDecoration: "none",
              color: "inherit",
              "&:hover": { color: "#000000" },
            }}
          >
            <Language sx={{ mr: "8px" }} /> ut.code(); の ウェブサイト
          </Link>

          <Link
            href="https://github.com/ut-code"
            target="_blank"
            sx={{
              display: "flex",
              mb: "16px",
              textDecoration: "none",
              color: "inherit",
              "&:hover": { color: "#000000" },
            }}
          >
            <GitHub sx={{ mr: "8px" }} /> ut.code(); の GitHub
          </Link>

          <Link
            href="https://x.com/utokyo_code"
            target="_blank"
            sx={{
              display: "flex",
              textDecoration: "none",
              color: "inherit",
              "&:hover": { color: "#000000" },
            }}
          >
            <XIcon sx={{ mr: "8px" }} /> ut.code(); の X (旧 Twitter)
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
