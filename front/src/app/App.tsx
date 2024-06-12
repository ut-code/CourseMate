import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#36A0F6",
    secondary: "#00D372",
  },
};

const App = (): JSX.Element => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
