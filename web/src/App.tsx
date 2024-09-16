import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/tabs/home";
import Profile from "./routes/tabs/profile";
import Login from "./routes/login";
import RegistrationPage from "./routes/registration/index";
import { getAuth } from "firebase/auth";
import { SnackbarProvider } from "notistack";
import Chat from "./routes/tabs/chat";
import { Friends } from "./routes/tabs/friends";

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
          path: "profile",
          element: <Profile />,
        },
        {
          path: "chat",
          element: <Chat />,
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
      <SnackbarProvider>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </>
  );
}
