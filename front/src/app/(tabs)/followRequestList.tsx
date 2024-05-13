import { View, ScrollView, StyleSheet } from "react-native";

import FollowerListItem from "../../components/FollowerListItem";

//今は適当にユーザーを羅列しているだけだが、実際はログイン時点で、「ログインしたユーザーにまつわるリクエスト」を基に画面を構成しなければならない

//ログインしたユーザーのuid
const currentUserId: number = 33;
//uidを基に、リクエストを探す
let matchRequests: {
  id: number;
  requestingUserId: number;
  requestedUserId: number;
}[];
fetch("http://localhost:3000/requests/" + currentUserId.toString(), {
  method: "post",
})
  .then((response) => {
    if (response.status === 201) {
      return response.json();
    } else {
      throw new Error("Failed to fetch matchRequests");
    }
  })
  .then((data) => {
    console.log("success: fetching matchRequests");
    matchRequests = data;
  });

const List = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <FollowerListItem
          name="Mike"
          imageUri="https://legacy.reactjs.org/logo-og.png"
        />
        {matchRequests.map((matchRequest) => (
          <div key={matchRequest.requestingUserId.toString()}>
            <FollowerListItem
              name={matchRequest.requestingUserId.toString()}
              imageUri="https://legacy.reactjs.org/logo-og.png"
            />
          </div>
        ))}
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
