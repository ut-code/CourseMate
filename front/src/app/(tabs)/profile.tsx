import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

import { useAuthContext } from "../../provider/AuthProvider";

const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

const Profile = (): JSX.Element => {
  // sample
  console.log(useAuthContext());
  const user = useAuthContext();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.backGroundImage} />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Name:</Text>
          <Text style={styles.profileText}>{user?.displayName}</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sex:</Text>
          <Text style={styles.profileText}>Male</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.profileLabel}>Sample:</Text>
          <Text style={styles.profileText}>Sample Text</Text>
        </View>
      </ScrollView>
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileLabel: {
    fontSize: 24,
    color: "#000000",
    padding: 10,
    flex: 1,
  },
  profileText: {
    fontSize: 20,
    color: "#000000",
    padding: 10,
    flex: 3,
  },
});

export default Profile;
