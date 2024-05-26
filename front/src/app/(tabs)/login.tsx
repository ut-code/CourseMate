import { GoogleAuthProvider, signInWithPopup ,signOut} from "firebase/auth";
import { View, Text, StyleSheet } from "react-native";

import Button from "../../components/Button";
import { auth } from "../../firebase/firebaseconfig";
const provider = new GoogleAuthProvider();

const signIn = (): void => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user.metadata);
      }
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.error(error);
    });
};
const signOutUser = (): void => {
  signOut(auth)
    .then(() => {
      console.log('サインアウトしました');
    })
    .catch((error) => {
      console.error('サインアウトエラー: ', error);
    });
};

const LogIn = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Log In</Text>
        <Button
          label="Log In"
          onPress={() => {
            signIn();
          }}
        />
        <Button
          label="Log Out"
          onPress={() => {
            signOutUser();
          }}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            東京大学のGoogleアカウントを用いてログインしてください
          </Text>
        </View>
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

export default LogIn;
