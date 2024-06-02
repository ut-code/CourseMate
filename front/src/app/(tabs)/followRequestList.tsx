import { View, ScrollView, StyleSheet } from "react-native";

import Button from "../../components/Button";
import ListItem from "../../components/ListItem";
import { useData } from "../../hooks/useData";
import { useAuthContext } from "../../provider/AuthProvider";
import { Relationship } from "../../types";

async function rejectMatchRequest(matchId: number) {
  try {
    const response = await fetch(
      `http://localhost:3000/requests/reject/${matchId.toString()}`,
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
  const url = `http://localhost:3000/requests/${currentUserId}`;

  const { data, isLoading, error } = useData<Relationship[]>(url);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <ScrollView>
          {data !== undefined &&
            data?.map((matchRequest) => (
              <div key={matchRequest.requestingUserId.toString()}>
                <ListItem
                  name={matchRequest.requestingUserId.toString()}
                  imageUri="https://legacy.reactjs.org/logo-og.png"
                >
                  <View>
                    <Button label="Accept" onPress={(): void => {}} />
                    <Button
                      label="Reject"
                      onPress={(): void => {
                        rejectMatchRequest(matchRequest.id);
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
