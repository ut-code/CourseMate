import Button from "./Button";
import signInWithGoogle from "../utils/signInWithGoogle";

const LogInButton = (): JSX.Element => {
  return (
    <Button
      label="Log In"
      onPress={() => {
        signInWithGoogle(false);
      }}
    />
  );
};

export default LogInButton;
