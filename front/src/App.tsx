import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import {
  BottomNavigation,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import FollowRequestList from "./pages/FollowRequestList";
import FollowerList from "./pages/FollowerList";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#36A0F6",
    secondary: "#00D372",
  },
};

const Tab = createBottomTabNavigator();

const App = (): JSX.Element => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={({ navigation, state, descriptors, insets }) => (
            <BottomNavigation.Bar
              navigationState={state}
              safeAreaInsets={insets}
              onTabPress={({ route, preventDefault }) => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (event.defaultPrevented) {
                  preventDefault();
                } else {
                  navigation.dispatch({
                    ...CommonActions.navigate(route.name, route.params),
                    target: state.key,
                  });
                }
              }}
              renderIcon={({ route, focused, color }) => {
                const { options } = descriptors[route.key];
                if (options.tabBarIcon) {
                  return options.tabBarIcon({ focused, color, size: 24 });
                }

                return null;
              }}
              getLabelText={({ route }) => {
                const { options } = descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                      ? options.title
                      : route.title;
                return label;
              }}
            />
          )}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => {
                return <Icon name="home" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: "Profile",
              tabBarIcon: ({ color, size }) => {
                return (
                  <Icon name="account-details" size={size} color={color} />
                );
              },
            }}
          />
          <Tab.Screen
            name="Followers"
            component={FollowerList}
            options={{
              tabBarLabel: "Followers",
              tabBarIcon: ({ color, size }) => {
                return <Icon name="account-group" size={size} color={color} />;
              },
            }}
          />
          <Tab.Screen
            name="Requests"
            component={FollowRequestList}
            options={{
              tabBarLabel: "Requests",
              tabBarIcon: ({ color, size }) => {
                return <Icon name="email-receive" size={size} color={color} />;
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
