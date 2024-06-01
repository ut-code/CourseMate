import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

import Button from "../components/Button";
import signUp from "../utils/signUp";

const SignUp = (): JSX.Element => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const user = useAuthContext();
  const user = getAuth().currentUser;
  console.log("私のuidは", user?.uid);
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.footerText}>サインアップページです</Text>
        <Text style={styles.footerText}>名前を設定してください</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="名前"
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="メール"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="パスワード"
          secureTextEntry
        />
        <Button
          label="設定"
          onPress={async () => {
            const uid = user?.uid;
            await signUp(uid!, name, password, email);
            console.log("設定ボタン押した際：", uid, name, password, email);
            router.push("/");
          }}
        />
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
