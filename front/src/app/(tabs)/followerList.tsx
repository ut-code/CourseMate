import { View, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Button from "../../components/Button";
import ListItem from "../../components/ListItem";

const List = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <ListItem
          name="John Doe"
          imageUri="https://legacy.reactjs.org/logo-og.png"
        >
          <TouchableOpacity>
            <Button label="Delete" onPress={(): void => {}} />
          </TouchableOpacity>
        </ListItem>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});

export default List;
