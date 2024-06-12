// import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native";

import { auth } from "../firebase/firebaseconfig";

const LogOutButton = (): JSX.Element => {
  // const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        signOutUser();
        // router.replace("/");
      }}
    >
      ログアウト
    </TouchableOpacity>
  );
};

const signOutUser = (): void => {
  signOut(auth)
    .then(() => {
      console.log("サインアウトしました");
    })
    .catch((error) => {
      console.error("サインアウトエラー: ", error);
    });
};

export default LogOutButton;
