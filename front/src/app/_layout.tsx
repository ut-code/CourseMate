import { Stack } from "expo-router";

const Layout = (): JSX.Element => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#467fd3",
        },
        headerTintColor: "#ffffff",
        headerTitle: "CourseMate",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  );
};

export default Layout;
