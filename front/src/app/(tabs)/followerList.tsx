import { View, ScrollView, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Button from "../../components/Button";
import ListItem from "../../components/ListItem";
import { useData } from "../../hooks/useData";
import { useAuthContext } from "../../provider/AuthProvider";
import { Relationship } from "../../types";

const FollowerList = () => {
  const currentUserId = useAuthContext()?.id;
  const url = `http://localhost:3000/requests/matched/${currentUserId}`;

  const { data, isLoading, error } = useData<Relationship[]>(url);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <ScrollView>
          {data?.map((matchRequest) => (
            <ListItem
              name={matchRequest.requestingUserId.toString()}
              imageUri="https://legacy.reactjs.org/logo-og.png"
              key={matchRequest.requestingUserId.toString()}
            >
              <TouchableOpacity>
                <Button label="Delete" onPress={(): void => {}} />
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
