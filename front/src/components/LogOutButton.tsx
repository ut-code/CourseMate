import { signOut } from "firebase/auth";
import { TouchableOpacity } from "react-native";

import { auth } from "../firebase/firebaseconfig";

const LogOutButton = ({ navigation }: { navigation: any }): JSX.Element => {
  // FIXME: any
  return (
    <TouchableOpacity
      onPress={() => {
        signOutUser();
        navigation.navigate("Login");
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
