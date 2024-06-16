import { View, ScrollView, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_ENDPOINT } from "../../env";
import Button from "../../components/Button";
import ListItem from "../../components/ListItem";
import useData from "../../hooks/useData";
import { useAuthContext } from "../../provider/AuthProvider";
import { User } from "../../types";

async function deleteMatch(senderId: number, receiverId: number){
  try {
    const response = await fetch(
      `${API_ENDPOINT}/matches/${senderId}/${receiverId}`,
      {
        method: "DELETE",
      }
    )
    const data = await response.json()
    return data;
  } catch {
    console.error();
  }
}

const FollowerList = () => {
  const currentUserId = useAuthContext()?.id;
  const url = `${API_ENDPOINT}/requests/matched/${currentUserId}`;

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
              <TouchableOpacity>
                <Button label="Delete" onPress={(): void => {deleteMatch(currentUserId!, matchedUser.id)}} />
              </TouchableOpacity>
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
