"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useAboutMe } from "~/api/user";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import EditableCoursesTable from "~/components/course/EditableCoursesTable";

export default function EditCourses() {
  const { state } = useAboutMe();
  const data = state.data;
  const loading = state.current === "loading";
  const error = state.current === "error" ? state.error : null;

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Box
        sx={{
          padding: "20px",
          maxWidth: "350px",
          height: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h1" mb={1}>
          授業編集
        </Typography>
        {loading ? (
          <FullScreenCircularProgress />
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data ? (
          <>
            <EditableCoursesTable userId={data.id} />
          </>
        ) : (
          <p>データがありません。</p>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Link href="/settings/profile" className="btn">
            設定画面に戻る
          </Link>
          <Link href="/edit/profile" className="btn btn-primary">
            プロフィール編集へ
          </Link>
        </Box>
      </Box>
    </NavigateByAuthState>
  );
}
