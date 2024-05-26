import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import Button from "../../components/Button";
import ListItem from "../../components/ListItem";

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

async function fetchMatchRequests() {
  try {
    const response = await fetch(
      `http://localhost:3000/requests/${currentUserId.toString()}`,
      {
        method: "post",
      },
    );
    const data = (await response.json()) as {
      id: number;
      requestingUserId: number;
      requestedUserId: number;
    }[];
    return data;
  } catch (error) {
    console.error(error);
  }
}

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

const List = () => {
  const [matchRequests, setMatchRequests] = useState<
    | {
        id: number;
        requestingUserId: number;
        requestedUserId: number;
      }[]
    | null
  >(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMatchRequests();
      if (data !== undefined) {
        setMatchRequests(data);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        {matchRequests !== undefined &&
          matchRequests?.map((matchRequest) => (
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
