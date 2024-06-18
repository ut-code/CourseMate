import { Stack } from "expo-router";

const Layout = (): JSX.Element => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
