import { View, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import ListItem from "../components/ListItem";
import useData from "../hooks/useData";
import { useAuthContext } from "../provider/AuthProvider";
import { User } from "../types";

async function rejectMatchRequest(senderId: number, receiverId: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/requests/reject/${senderId.toString()}/${receiverId.toString()}`,
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

const FollowRequestList = () => {
  const currentUserId = useAuthContext()?.id;
  const url = `http://localhost:3000/requests/receiverId/${currentUserId}`;

  const { data, isLoading, error } = useData<User[]>(url);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ScrollView>
          {data !== undefined &&
            data?.map((matchedUser) => (
              <div key={matchedUser.id.toString()}>
                <ListItem
                  name={matchedUser.name.toString()}
                  imageUri="https://legacy.reactjs.org/logo-og.png"
                >
                  <View>
                    <Button onPress={(): void => {}}>Accept</Button>
                    <Button
                      onPress={(): void => {
                        rejectMatchRequest(matchedUser.id, currentUserId!); // TODO: Fix this
                      }}
                    >
                      Reject
                    </Button>
                  </View>
                </ListItem>
              </div>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});

export default FollowRequestList;
