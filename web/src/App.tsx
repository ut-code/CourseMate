import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/tabs/home";
import Settings from "./routes/tabs/settings";
import Login from "./routes/login";
import SignUp from "./routes/signUp";
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
          path: "settings",
          element: <Settings />,
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
      element: <SignUp />,
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
