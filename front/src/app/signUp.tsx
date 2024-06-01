import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { View, Text, StyleSheet, TextInput } from "react-native";

import Button from "../components/Button";
import { auth } from "../firebase/firebaseconfig";

const provider = new GoogleAuthProvider();

const signIn = async (): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log(user.metadata);
      console.log("ログインに成功しました");
    }
  } catch (error) {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.customData.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.error(error);
    console.log("ログインに失敗しました");
  }
};

const SignUp = (): JSX.Element => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Sign UP</Text>
        <Text style={styles.footerText}>サインアップページです</Text>
        <Text style={styles.footerText}>名前を設定してください</Text>
        <TextInput
          style={styles.input}
          // onChangeText={onChangeText}
          // value={text}
        />
        <Button label={"設定"} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  inner: {
    paddingHorizontal: 27,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    width: 128,
    height: 48,
    borderColor: "#dddddd",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
    color: "#467fd3",
  },
});

export default SignUp;
