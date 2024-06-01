import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import Button from "./Button";

interface Props {
  name: string;
  imageUri: string;
  buttonType?: string;
  matchId: number;
}

//フォローリクエストを拒否するリクエストをサーバーに送る
const reject = (matchId: number): void => {
  fetch("http://localhost:3000/requests/reject/" + matchId.toString(), {
    method: "put",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("reject request Failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
};
const accept = (matchId: number): void => {
  fetch("http://localhost:3000/requests/accept/" + matchId.toString(),{
    method: "put",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("reject request Failed");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
}

const followerListItem = (props: Props): JSX.Element => {
  const { name, imageUri, buttonType, matchId } = props;
  const image = { uri: imageUri };

  const deleteButton = <Button label="Delete" onPress={(): void => {}} />;
  const acceptButton = (
    <Button
      label="Accept"
      onPress={(): void => {
        accept(matchId)
      }}
    />
  );
  const rejectButton = (
    <Button
      label="Reject"
      onPress={(): void => {
        reject(matchId);
      }}
    />
  );
  const button =
    buttonType === "delete" ? (
      deleteButton
    ) : (
      <View>
        {acceptButton}
        {rejectButton}
      </View>
    );

  return (
    <Link href="/profile" asChild>
      <TouchableOpacity style={styles.followerListItem}>
        <View>
          <Image source={image} style={styles.followerListItemImage} />
          <Text style={styles.followerListItemTitle}>{name}</Text>
        </View>
        <TouchableOpacity>{button}</TouchableOpacity>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  followerListItem: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 19,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.15)",
  },
  followerListItemTitle: {
    fontSize: 16,
    lineHeight: 32,
  },
  followerListItemImage: {
    width: 40,
    height: 40,
  },
});

export default followerListItem;
