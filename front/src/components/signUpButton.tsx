import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native";

import { auth } from "../firebase/firebaseconfig";

const SignUpButton = (): JSX.Element => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        signUpUser();
        router.replace("/signUp");
      }}
    >
      サインアップ
    </TouchableOpacity>
  );
};

const signUpUser = (): void => {
  signOut(auth)
    .then(() => {
      console.log("サインアウトしました");
    })
    .catch((error) => {
      console.error("サインアウトエラー: ", error);
    });
};

export default SignUpButton;
