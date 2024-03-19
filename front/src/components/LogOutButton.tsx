import { Text, TouchableOpacity, StyleSheet } from "react-native";

const LogOutButton = (): JSX.Element => {
  return (
    <TouchableOpacity>
      <Text style={styles.logOutButtonLabel}>ログアウト</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logOutButtonLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    lineHeight: 32,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
});

export default LogOutButton;
