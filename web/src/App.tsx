import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { SnackbarProvider } from "notistack";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { NavigateByAuthState } from "./components/common/NavigateByAuthState";
import EditCourses from "./routes/editCourses";
import EditProfile from "./routes/editProfile";
import Login from "./routes/login";
import RegistrationPage from "./routes/registration/index";
import Root from "./routes/root";
import Chat from "./routes/tabs/chat";
import { Friends } from "./routes/tabs/friends";
import Home from "./routes/tabs/home";
import Settings from "./routes/tabs/settings";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <p>Sorry, an unexpected error has occurred.</p>,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />,
        },
        {
          path: "home",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Home />
            </NavigateByAuthState>
          ),
        },
        {
          path: "friends",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Friends />
            </NavigateByAuthState>
          ),
        },
        {
          path: "settings",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Settings />
            </NavigateByAuthState>
          ),
        },
        {
          path: "chat",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Chat />
            </NavigateByAuthState>
          ),
        },
        {
          path: "edit/profile",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <EditProfile />
            </NavigateByAuthState>
          ),
        },
        {
          path: "edit/courses",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <EditCourses />
            </NavigateByAuthState>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <NavigateByAuthState type="toHomeForAuthenticated">
          <Login />
        </NavigateByAuthState>
      ),
    },
    {
      path: "/signup",
      element: (
        <NavigateByAuthState type="toHomeForAuthenticated">
          <RegistrationPage />
        </NavigateByAuthState>
      ),
    },
  ]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#039BE5",
    },
    secondary: {
      main: "#E9F8FF",
    },
  },
});
