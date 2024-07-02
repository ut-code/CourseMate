import React, { ChangeEvent, useState } from "react";
import { auth } from "../../firebase/firebaseconfig.js";
import { supabase } from "../../supabase/supabase.js";
import signUp from "./signUp.js";

const SignUpPage = (): JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [sex, setSex] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const user = auth.currentUser;
  console.log("私のuidは", user?.uid);

  const sexOptions = [
    { label: "男", value: "男" },
    { label: "女", value: "女" },
    { label: "その他", value: "その他" },
  ];

  const handleSignUp = async () => {
    const uid = user?.uid;
    if (uid) {
      let photoUrl = null;
      if (photo) {
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`${uid}/${photo.name}`, photo, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Image upload error:", error);
        } else {
          photoUrl = data.path;
        }
      }
      await signUp(uid, name, email, selfIntro, sex, photo);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.inner as React.CSSProperties}>
        <h1 style={styles.title as React.CSSProperties}>Sign Up</h1>
        <p style={styles.footerText as React.CSSProperties}>サインアップページです</p>
        <p style={styles.footerText as React.CSSProperties}>ユーザー情報を登録してください</p>
        <input
          style={styles.input as React.CSSProperties}
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="名前"
        />
        <input
          style={styles.input as React.CSSProperties}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="メール"
          type="email"
        />
        <input
          style={styles.input as React.CSSProperties}
          onChange={(e) => setSelfIntro(e.target.value)}
          value={selfIntro}
          placeholder="自己紹介"
        />
        <select
          style={styles.dropdown as React.CSSProperties}
          value={sex}
          onChange={(e) => setSex(e.target.value)}
        >
          {sexOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleImageChange} />
        {photo && <img src={URL.createObjectURL(photo)} alt="Selected" style={styles.image as React.CSSProperties} />}
        <button onClick={handleSignUp}>登録</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    height: "100vh",
  },
  inner: {
    width: "100%",
    maxWidth: "400px",
    padding: "24px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  title: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: "bold",
    marginBottom: "24px",
  },
  input: {
    fontSize: "16px",
    width: "100%",
    height: "48px",
    borderColor: "#dddddd",
    borderWidth: "1px",
    backgroundColor: "#ffffff",
    padding: "8px",
    marginBottom: "16px",
    boxSizing: "border-box" as const,
  },
  dropdown: {
    width: "100%",
    height: "48px",
    borderColor: "#dddddd",
    borderWidth: "1px",
    backgroundColor: "#ffffff",
    padding: "8px",
    marginBottom: "16px",
    boxSizing: "border-box" as const,
  },
  footerText: {
    fontSize: "14px",
    lineHeight: "24px",
    marginRight: "8px",
    marginBottom: "16px",
  },
  image: {
    width: "100px",
    height: "100px",
    marginVertical: "16px",
    objectFit: "cover" as const,
  },
};

export default SignUpPage;
