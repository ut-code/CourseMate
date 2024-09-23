import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { register } from "./functions";
import Step1, { type Step1Data } from "./steps/step1";
import Step2, { type Step2Data } from "./steps/step2";
import Confirmation from "./steps/step3";
import Step4 from "./steps/step4";

function Registration() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [step1Data, setStep1Data] = useState<Step1Data>();
  const [step2Data, setStep2Data] = useState<Step2Data>();

  switch (step) {
    case 1:
      return (
        <Step1
          caller="registration"
          prev={step1Data}
          onSave={(data) => {
            setStep1Data(data);
            setStep(2);
          }}
        />
      );
    case 2:
      return (
        <Step2
          caller="registration"
          prev={step2Data}
          onSave={(data) => {
            setStep2Data(data);
            setStep(3);
          }}
          back={() => setStep(1)}
        />
      );
    case 3:
      return (
        <Confirmation
          caller="registration"
          onSave={async () => {
            if (!step1Data) throw new Error("don't skip the steps");
            if (!step2Data) throw new Error("don't skip the steps");
            const concat = {
              ...step1Data,
              ...step2Data,
            };
            try {
              await register(concat, { enqueueSnackbar, navigate });
              setStep(4);
            } catch (error) {
              enqueueSnackbar("サインアップに失敗しました", {
                variant: "error",
              });
            }
          }}
          back={() => setStep(2)}
          Step1Data={step1Data}
          Step2Data={step2Data}
        />
      );
    case 4:
      return <Step4 />;
  }
}
export default function RegistrationPage() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "56px",
        bottom: "56px",
        left: 0,
        right: 0,
        overflowY: "auto",
      }}
    >
      <Header title="Sign Up" />
      <Registration />
    </Box>
  );
}
