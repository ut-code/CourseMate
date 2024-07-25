import { View, ScrollView, StyleSheet } from "react-native";

import { User, UserID } from "../../../../common/types";
import Button from "../../components/Button";
import ListItem from "../../components/ListItem";
import { API_ENDPOINT } from "../../env";
import useData from "../../hooks/useData";
import { useAuthContext } from "../../provider/AuthProvider";

async function rejectMatchRequest(senderId: UserID, receiverId: UserID) {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/requests/reject/${senderId.toString()}/${receiverId.toString()}`,
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

async function acceptMatchRequest(senderId: UserID, receiverId: UserID) {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/requests/accept/${senderId.toString()}/${receiverId.toString()}`,
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
  const url = `${API_ENDPOINT}/requests/receiverId/${currentUserId}`;

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
                    <Button
                      label="Accept"
                      onPress={(): void => {
                        acceptMatchRequest(matchedUser.id, currentUserId!);
                      }}
                    />
                    <Button
                      label="Reject"
                      onPress={(): void => {
                        rejectMatchRequest(matchedUser.id, currentUserId!); // TODO: Fix this
                      }}
                    />
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
