import { Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { register } from "./functions";
import { useState } from "react";
import Step1, { Step1Data } from "./steps/step1";
import Step2, { Step2Data } from "./steps/step2";
import Step3, { Step3Data } from "./steps/step3";
import Confirmation from "./steps/step4";

function Registration() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [step1Data, setStep1Data] = useState<Step1Data>();
  const [step2Data, setStep2Data] = useState<Step2Data>();
  const [step3Data, setStep3Data] = useState<Step3Data>();

  switch (step) {
    case 1:
      return (
        <Step1
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
        <Step3
          prev={step3Data}
          onSave={(data) => {
            setStep3Data(data);
            setStep(4);
          }}
          back={() => setStep(2)}
        />
      );
    case 4:
      return (
        <Confirmation
          onSave={() => {
            if (!step1Data) throw new Error("don't skip the steps");
            if (!step2Data) throw new Error("don't skip the steps");
            if (!step3Data) throw new Error("don't skip the steps");
            const concat = {
              ...step1Data,
              ...step2Data,
              ...step3Data,
            };
            register(concat, { enqueueSnackbar, navigate });
          }}
          back={() => setStep(3)}
        />
      );
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
