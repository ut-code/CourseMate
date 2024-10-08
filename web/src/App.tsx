import { CssBaseline, Link, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { SnackbarProvider } from "notistack";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RoomWindow } from "./components/chat/RoomWindow";
import { NavigateByAuthState } from "./components/common/NavigateByAuthState";
import EditCourses from "./routes/editCourses";
import EditProfile from "./routes/editProfile";
import FAQ from "./routes/faq";
import Login from "./routes/login";
import RegistrationPage from "./routes/registration/index";
import Root from "./routes/root";
import Chat from "./routes/tabs/chat";
import { Friends } from "./routes/tabs/friends";
import Home from "./routes/tabs/home";
import AboutUs from "./routes/tabs/settings/aboutUs";
import Contact from "./routes/tabs/settings/contact";
import DeleteAccount from "./routes/tabs/settings/deleteAccount";
import Disclaimer from "./routes/tabs/settings/disclaimer";
import Profile from "./routes/tabs/settings/profile";
import Settings from "./routes/tabs/settings/settings";
import Tutorial from "./routes/tutorial";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: (
        <p>
          Sorry, an unexpected error has occurred.{" "}
          <Link href="/home">Go Back</Link>
        </p>
      ),
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
          path: "settings/profile",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Profile />
            </NavigateByAuthState>
          ),
        },
        {
          path: "settings/contact",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Contact />
            </NavigateByAuthState>
          ),
        },
        {
          path: "settings/aboutUs",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <AboutUs />
            </NavigateByAuthState>
          ),
        },
        {
          path: "settings/disclaimer",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <Disclaimer />
            </NavigateByAuthState>
          ),
        },
        {
          path: "settings/delete",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <DeleteAccount />
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
          path: "chat/:friendId",
          element: (
            <NavigateByAuthState type="toLoginForUnauthenticated">
              <RoomWindow />
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
      element: <RegistrationPage />,
    },
    {
      path: "/faq",
      element: <FAQ />,
    },
    {
      path: "/tutorial",
      element: <Tutorial />,
    },
    {
      path: "*",
      element: (
        <p>
          お探しのリンクは見つかりませんでした。 <Link href="/home">戻る</Link>
        </p>
      ),
    },
  ]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          autoHideDuration={2000}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
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
