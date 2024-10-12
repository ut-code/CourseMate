import { Box, Button, Typography } from "@mui/material";
import type { Step1User } from "../../../common/zod/types";
import UserAvatar from "../../../components/human/avatar";
import type { BackProp, StepProps } from "../common";
import type { Step2Data } from "./step2_img";

interface UserInfoProp {
  name: string;
  gender: string;
  grade: string;
  faculty: string;
  department: string;
  intro: string;
  pictureUrl: string;
}

interface inputDataProps {
  Step1Data: Step1User | undefined;
  Step2Data: Step2Data | undefined;
}

export default function Confirmation({
  onSave,
  back,
  Step1Data,
  Step2Data,
}: StepProps<void> & BackProp & inputDataProps) {
  if (!Step1Data || !Step2Data) {
    throw new Error("don't skip the steps");
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "20px",
        }}
      >
        <Typography variant="h6" component="h1" mb={2}>
          確認
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardFront UserInfo={{ ...Step1Data, ...Step2Data }} />
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>この内容で登録しますか？</p>
        </div>
      </div>
      <Box
        p={3}
        sx={{
          position: "fixed",
          display: "flex",
          justifyContent: "space-between",
          bottom: 0,
          width: "100%",
        }}
      >
        <Button onClick={back} variant="text">
          前へ
        </Button>
        <Button onClick={() => onSave()} variant="contained">
          次へ
        </Button>
      </Box>
    </>
  );
}

function CardFront({ UserInfo }: { UserInfo: UserInfoProp }) {
  return (
    <div
      style={{
        width: "70vw",
        height: "70vh",
        position: "relative",
        backgroundColor: "#F7FCFF",
        border: "2px solid #3596C6",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <div style={{ width: "50%", maxWidth: "300px", maxHeight: "300px" }}>
          <UserAvatar
            pictureUrl={UserInfo?.pictureUrl}
            width="80%"
            height="auto"
          />
        </div>
        <p style={{ fontSize: "4vw", fontWeight: "bold" }}>{UserInfo?.name}</p>
      </div>
      <div style={{ padding: "10px" }}>
        {UserInfo?.grade && <p>学年： {UserInfo.grade}</p>}
        {UserInfo?.faculty && <p>学部： {UserInfo.faculty}</p>}
        {UserInfo?.department && <p>学科： {UserInfo.department}</p>}
        {UserInfo?.gender && <p>性別： {UserInfo?.gender}</p>}
        {UserInfo?.intro && <p>自己紹介: {UserInfo.intro}</p>}
      </div>
    </div>
  );
}
