import { Stack } from "expo-router";
<script src="http://localhost:8097"></script>

const Layout = (): JSX.Element => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
