import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { getAuth } from "firebase/auth";
import { SnackbarProvider } from "notistack";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
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
  const PrivateRoute = () => {
    // Google アカウントでログインしていれば home に、ログインしていなければ login にリダイレクト
    return getAuth().currentUser ? (
      <Navigate to="/home" />
    ) : (
      <Navigate to="/login" />
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <p>Sorry, an unexpected error has occurred.</p>,
      children: [
        {
          index: true,
          element: <PrivateRoute />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "friends",
          element: <Friends />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "edit/profile",
          element: <EditProfile />,
        },
        {
          path: "edit/courses",
          element: <EditCourses />,
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
    {
      path: "/chat",
      element: <Chat />,
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
