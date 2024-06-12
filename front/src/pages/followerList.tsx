import { View, ScrollView, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";

import ListItem from "../components/ListItem";
import useData from "../hooks/useData";
import { useAuthContext } from "../provider/AuthProvider";
import { User } from "../types";

const FollowerList = () => {
  const currentUserId = useAuthContext()?.id;
  const url = `http://localhost:3000/requests/matched/${currentUserId}`;

  const { data, isLoading, error } = useData<User[]>(url);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <ScrollView>
          {data?.map((matchedUser) => (
            <ListItem
              name={matchedUser.name.toString()}
              imageUri="https://legacy.reactjs.org/logo-og.png"
              key={matchedUser.id.toString()}
            >
              <Button onPress={(): void => {}}>Delete</Button>
            </ListItem>
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

export default FollowerList;
