import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

import { User } from "../../../../common/types";
import Button from "../../components/Button";
import { API_ENDPOINT } from "../../env";
import { useAuthContext } from "../../provider/AuthProvider";

const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

const Index = (): JSX.Element => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [displayedUser, setDisplayedUser] = useState<User | null>(null);
  const currentUserId = useAuthContext()?.id;

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch(`${API_ENDPOINT}/users/all`);
        const data = await response.json();
        if (!currentUserId) return;
        const otherUsers = data.filter(
          (user: User) => user.id !== currentUserId,
        );
        setUsers(otherUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (users) {
      const randomIndex = Math.floor(Math.random() * users.length);
      setDisplayedUser(users[randomIndex]);
    }
  }, [users]);

  const handlePressCross = (): void => {
    if (!users || !displayedUser) return;
    const newUsers = users?.filter((user) => user.id !== displayedUser?.id);
    setUsers(newUsers);
  };

  const handlePressCircle = (): void => {
    if (!displayedUser) return;
    try {
      fetch(`${API_ENDPOINT}/requests/sendMatchRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: displayedUser.id,
        }),
      });
    } catch (error) {
      console.error("Error liking user:", error);
    }
    if (!users) return;
    const newUsers = users?.filter((user) => user.id !== displayedUser?.id);
    setUsers(newUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.backGroundImage}>
          <View style={styles.nameTagContainer}>
            <Text style={styles.nameTagLabel}>
              Name:
              {displayedUser?.name}
            </Text>
            <Text style={styles.nameTagLabel}>
              id:
              {displayedUser?.id}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.buttonContainer}>
        <Button label="X" onPress={handlePressCross} />
        <Button label="O" onPress={handlePressCircle} />
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
