import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

import Button from "../../components/Button";
import { useAuthContext } from "../../provider/AuthProvider";

const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

interface User {
  id: number;
  name: string;
  uid: string;
}

const Index = (): JSX.Element => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [displayedUser, setDisplayedUser] = useState<User | null>(null);
  const currentUserUid = useAuthContext()?.uid;

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        if (!currentUserUid) return;
        const otherUsers = data.filter(
          (user: User) => user.uid !== currentUserUid,
        );
        setUsers(otherUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getUsers();
  }, [currentUserUid]);

  useEffect(() => {
    if (users) {
      const randomIndex = Math.floor(Math.random() * users.length);
      setDisplayedUser(users[randomIndex]);
    }
  }, [users]);

  const handlePress = (): void => {
    if (!users || !displayedUser) return;
    const newUsers = users?.filter((user) => user.id !== displayedUser?.id);
    setUsers(newUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.backGroundImage}>
          <View style={styles.nameTagContainer}>
            <Text style={styles.nameTagLabel}>
              Profile Name Sample
              {displayedUser?.name}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.buttonContainer}>
        <Button label="X" onPress={handlePress} />
        <Button label="O" onPress={handlePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  backGroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  nameTagContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  nameTagLabel: {
    fontSize: 24,
    color: "#ffffff",
    padding: 10,
  },
  nameTagText: {
    fontSize: 16,
    color: "#ffffff",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
  },
});

export default Index;
