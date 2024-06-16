import { Button } from "react-native-paper";

import signInWithGoogle from "../utils/signInWithGoogle";

const SignUpButton = ({ navigation }: { navigation: any }): JSX.Element => {
  // FIXME: any
  return (
    <Button
      onPress={async () => {
        await signInWithGoogle(true, navigation);
        navigation.navigate("SignUp");
      }}
    >
      Sign Up
    </Button>
  );
};

export default SignUpButton;
