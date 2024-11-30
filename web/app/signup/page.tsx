"use client";

import { useSnackbar } from "notistack";
import { useState } from "react";

import type { Step1User } from "common/zod/types";
import { useRouter } from "next/navigation";
import request from "~/api/request";
import Header from "~/components/Header";
import { NavigateByAuthState } from "~/components/common/NavigateByAuthState";
import { register } from "./functions";
import Step1 from "./steps/step1_profile";
import Step2, { type Step2Data } from "./steps/step2_img";
import Confirmation from "./steps/step3_confirmation";
import Step4 from "./steps/step4_course";

function matchWithMemo() {
  request.autoMatch();
}

function Registration() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [step1Data, setStep1Data] = useState<Step1User>();
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
              await register(concat, { enqueueSnackbar, router });
              matchWithMemo();
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
    <NavigateByAuthState type="toHomeForAuthenticated">
      <div className="absolute top-14 right-0 bottom-0 left-0 overflow-y-auto">
        <Header title="登録/Register" />
        <Registration />
      </div>
    </NavigateByAuthState>
  );
}
