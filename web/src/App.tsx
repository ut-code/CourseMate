import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { SnackbarProvider } from "notistack";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RedirectUnauthenticated } from "./components/common/RedirectUnauthenticated";
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
            <RedirectUnauthenticated>
              <Home />
            </RedirectUnauthenticated>
          ),
        },
        {
          path: "friends",
          element: (
            <RedirectUnauthenticated>
              <Friends />
            </RedirectUnauthenticated>
          ),
        },
        {
          path: "settings",
          element: (
            <RedirectUnauthenticated>
              <Settings />
            </RedirectUnauthenticated>
          ),
        },
        {
          path: "chat",
          element: (
            <RedirectUnauthenticated>
              <Chat />
            </RedirectUnauthenticated>
          ),
        },
        {
          path: "edit/profile",
          element: (
            <RedirectUnauthenticated>
              <EditProfile />
            </RedirectUnauthenticated>
          ),
        },
        {
          path: "edit/courses",
          element: (
            <RedirectUnauthenticated>
              <EditCourses />
            </RedirectUnauthenticated>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <RegistrationPage />,
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
