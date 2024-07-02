import signInWithGoogle from "../utils/signUp/signUpButton";
import { Button } from "@mui/material";

const LogIn = () => {
  return (
    <div className="container">
      <div className="inner">
        <h1 className="title">ログインかサインインか選択してください</h1>
        <Button
          className="button"
          onClick={async () => {
            await signInWithGoogle();
          }}
        >
          Log In
        </Button>
        <Button
          className="button"
          onClick={async () => {
            await signInWithGoogle();
          }}
        >
          Sign Up
        </Button>
        <div className="footer">
          <p className="footerText">
            東京大学のGoogleアカウントを用いてください
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
