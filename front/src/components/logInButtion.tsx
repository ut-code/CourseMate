import { Button } from "react-native-paper";

import signInWithGoogle from "../utils/signInWithGoogle";

const LogInButton = (navigation: any): JSX.Element => {
  // FIXME: any
  return (
    <Button
      onPress={() => {
        signInWithGoogle(false, navigation);
      }}
    >
      Login
    </Button>
  );
};

export default LogInButton;
