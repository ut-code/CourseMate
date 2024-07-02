// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button } from "@mui/material";

const SignInButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // ログイン成功後の処理
      if (result.user) {
        navigate("/dashboard");
      }
    } catch (err) {
      // setError(err);
    }
  };

  return (
    <Button
      className="button"
      onClick={async () => {
        await signInWithGoogle();
      }}
    >
      Sign Up
    </Button>
  );
};

export default SignInButton;
