import { useRouter } from "expo-router";

import Button from "./Button";
import signInWithGoogle from "../utils/signInWithGoogle";

const LogInButton = (): JSX.Element => {
  const router = useRouter();
  return (
    <Button
      label="Log In"
      onPress={async () => {
        await signInWithGoogle();
        router.push("/");
      }}
    />
  );
};

export default LogInButton;
