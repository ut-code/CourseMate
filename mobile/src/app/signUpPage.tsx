import React, { ChangeEvent, useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { launchImageLibrary, Asset } from "react-native-image-picker";
import { getAuth } from "firebase/auth";
import { supabase } from "../supabase/supabase";
import Button from "../components/Button";
import signUp from "../utils/signUp";

const SignUp = (): JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [sex, setSex] = useState("");
  const [photo, setPhoto] = useState<Asset | null>(null);

  const user = getAuth().currentUser;
  console.log("私のuidは", user?.uid);

  const sexOptions = [
    { label: "男", value: "男" },
    { label: "女", value: "女" },
    { label: "その他", value: "その他" },
  ];

  // const handleSignUp = async () => {
  //   const uid = user?.uid;
  //   if (uid) {
  //     let photoUrl = null;
  //     if (photo && photo.uri && photo.type && photo.fileName) {
  //       const response = await fetch(photo.uri);
  //       console.log("response", response);
  //       const blob = await response.blob();
  //       const { data, error } = await supabase.storage
  //         .from("avatars")
  //         .upload(`${uid}/${photo.fileName}`, blob, {
  //           cacheControl: "3600",
  //           upsert: false,
  //         });

  //       if (error) {
  //         console.error("Image upload error:", error);
  //       } else {
  //         photoUrl = data.path;
  //       }
  //     }
  //     await signUp(uid, name, email, selfIntro, sex, photo);
  //   }
  // };

  const handleImageChange = async (uri: string, fileName: string): Promise<void> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const user = getAuth().currentUser;
  
    const filePath = `${user?.uid}/${fileName}`; // 画像の保存先のpathを指定
    const { error } = await supabase.storage
      .from(`${user?.uid}`)
      .upload(filePath, blob);
  
    if (error) {
      // ここでエラーハンドリング
      Alert.alert('Error uploading image:', error.message);
    } else {
      Alert.alert('Image uploaded successfully');
    }
  };
  
  const handlePress = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const { uri, fileName } = response.assets[0];
          if (uri && fileName) {
            handleImageChange(uri, fileName);
          }
        }
      }
    );
  };

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
          onChangeText={setSelfIntro}
          value={selfIntro}
          placeholder="自己紹介"
        />
        <Dropdown
          style={styles.dropdown}
          data={sexOptions}
          labelField="label"
          valueField="value"
          placeholder="性別"
          value={sex}
          onChange={(item) => {
            setSex(item.value);
          }}
        />
        <Button label="Select Image" onPress={handlePress} />
        {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
        {/* <Button label="設定" onPress={handleSignUp} /> */}
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
    width: "100%",
    height: 48,
    borderColor: "#dddddd",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 16,
  },
  dropdown: {
    width: "100%",
    height: 48,
    borderColor: "#dddddd",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 16,
  },
});

export default SignUp;
