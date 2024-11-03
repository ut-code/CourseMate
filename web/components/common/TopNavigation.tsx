import { ArrowBack } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";

/**
 * Settings の子ページから Setting に戻るナビゲーションを提供
 */
export default function TopNavigation({ title }: { title: string }) {
  return (
    <Box
      py={1}
      sx={{
        display: "flex",
        alignItems: "center",
        // 主に profile ページ向け。calc(画面縦幅 - カード縦幅 - ヘッダー幅 - ボトムナビ幅 - ページの py - 編集ボタンの高さ)。
        height: "min(56px, calc(100dvh - 70dvh - 56px - 56px - 16px - 36px))",
      }}
    >
      <IconButton LinkComponent={Link} href="/settings">
        <ArrowBack />
      </IconButton>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: "bold",
          // タイトルを中央に寄せる。矢印が左にしかないため。
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
