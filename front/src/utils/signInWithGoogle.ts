import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../firebase/firebaseconfig";

const provider = new GoogleAuthProvider();

const signInWithGoogle = async (
  signup: boolean,
  navigation: any,
): Promise<void> => {
  // FIXME: any
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
      if (signup) {
        navigation.navigate("SignUp");
        // router.push("/signUpPage");
      } else {
        navigation.navigate("AppHome");
        // router.push("/home");
      }
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

export default signInWithGoogle;
