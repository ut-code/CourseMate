"use client";

import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

export default function FAQ() {
  const router = useRouter();

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "56px",
        bottom: 0,
        left: 0,
        right: 0,
        overflowY: "auto",
      }}
    >
      <Header title="よくある質問/FAQ" />
      <IconButton
        sx={{ position: "absolute", top: "20px", left: "20px" }}
        onClick={() => router.back()}
      >
        <ArrowBack />
      </IconButton>

      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          padding: "30px",
          textAlign: "left",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: "24px", textAlign: "center" }}
        >
          よくある質問
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          <strong>Q: 東大生以外も利用できますか？</strong>
          <br />
          A:
          本サービスは東大生のみを対象としています。それゆえ、ECCSアカウントによるログインが必須です。他のGoogleアカウントではログインできません。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          <strong>Q: 授業登録機能はすべての学部に対応していますか？</strong>
          <br />
          A:
          本サービスの授業登録機能は前期教養学部のみに対応しており、今のところ後期学部には対応しておりません。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          <strong>Q: 収集された個人情報はどのように利用されますか？</strong>
          <br />
          A:
          収集した個人情報は、サインインおよびサービス提供の目的にのみ使用され、他の目的には使用されません。
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{ lineHeight: 1.8, mb: "16px" }}
        >
          <strong>Q: 東大公式のアプリですか？</strong>
          <br />
          A:
          本サービスはut.code();によって運営されており、東京大学は運営に関与しておりません
        </Typography>
      </Box>
    </Box>
  );
}
