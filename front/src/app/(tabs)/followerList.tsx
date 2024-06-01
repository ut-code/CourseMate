import { View, ScrollView, StyleSheet } from "react-native";

import FollowerListItem from "../../components/FollowerListItem";
//ログインしたユーザーのid
const currentUserId: number = 33;
//idを基に、フォロワーを探す
let matches: {
  id: number;
  requestingUserId: number;
  requestedUserId: number;
}[];
fetch("http://localhost:3000/requests/matched/" + currentUserId.toString(), {
  method: "post",
})
  .then((response) => {
    if (response.status === 201) {
      return response.json();
    } else {
      throw new Error("Failed to fetch matchedUsers");
    }
  })
  .then((data) => {
    console.log("success: fetching matchedUsers");
    matches = data;
  });


const List = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {matches.map((match) => (
        <div key={match.id}>
          <FollowerListItem
            name={match.requestedUserId.toString() +"と"+ match.requestingUserId.toString()}
            imageUri="https://legacy.reactjs.org/logo-og.png"
            matchId={match.id}
          />
        </div>
      ))}
        {/* <FollowerListItem
          name="John"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        />
        <FollowerListItem
          name="User Name"
          imageUri="https://legacy.reactjs.org/logo-og.png"
          buttonType="delete"
        /> */}
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
