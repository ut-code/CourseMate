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
  })
  .catch((error) => {
    // Handle Errors here.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // The email of the user's account used.
    // const email = error.customData.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.error(error);
  });

const List = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {matchRequests.map((matchRequest) => (
          <div key={matchRequest.requestingUserId.toString()}>
            <FollowerListItem
              name={matchRequest.requestingUserId.toString()}
              imageUri="https://legacy.reactjs.org/logo-og.png"
              matchId={matchRequest.id}
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
