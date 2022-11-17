import { useContext } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Layout from "./components/Layout/Layout";
import ProfilePage from "./pages/ProfilePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";
import { action as signUpAction } from "./pages/SignUpPage";
import { action as logInAction } from "./pages/LogInPage";
import { action as newPassAction } from "./pages/ProfilePage";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          element: <Layout />,
          children: [
            { path: "/", element: <Navigate replace to={"/Home"} /> },
            {
              path: "/Home",
              element: !authCtx.isLoggedIn ? (
                <HomePage />
              ) : (
                <Navigate replace to="/profile" />
              ),
            },
            {
              path: "/login",
              element: !authCtx.isLoggedIn ? (
                <LogInPage />
              ) : (
                <Navigate replace to="/profile" />
              ),
              action: logInAction,
            },
            {
              path: "/signup",
              element: !authCtx.isLoggedIn ? (
                <SignUpPage />
              ) : (
                <Navigate replace to="/profile" />
              ),
              action: signUpAction,
            },
            {
              path: "/profile",
              element: authCtx.isLoggedIn ? (
                <ProfilePage />
              ) : (
                <Navigate replace to="/" />
              ),
              action: newPassAction,
            },
            { path: "*", element: <Navigate replace to={"/"} /> },
          ],
        },
      ])}
    />
  );
}

export default App;
