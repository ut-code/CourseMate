import { useRouter } from "expo-router";

import Button from "./Button";
import signInWithGoogle from "../utils/signInWithGoogle";

const SignUpButton = (): JSX.Element => {
  const router = useRouter();
  return (
    <Button
      label="Sign Up"
      onPress={async () => {
        await signInWithGoogle();
        router.push("/signUp");
      }}
    />
  );
};

export default SignUpButton;
