import { Login } from "/src/pages/login/Login";
import { Signup } from "/src/pages/signup/Signup";
import { Feed } from "/src/pages/feed/Feed.jsx";
import { Home } from "/src/pages/home/Home.jsx";

import { store } from "/src/store/store";
import { Provider, useDispatch } from "react-redux";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/profile/Profile";
import FeedReactions from "./pages/feed-reactions/FeedReactions";

import Verification from "./pages/signup/Verification";
import Routers from "./routers";
import ProtectedRoute from "./protectedRoutes";
import { ForgotPassword } from "./pages/forgot-password/ForgotPassword";
import { ResetPassword } from "./pages/reset-password/ResetPassword";
import PageNotFound from "./pages/NotFound/PageNotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <Login />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <ForgotPassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <ResetPassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <Signup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify",
    element: (
      <ProtectedRoute allowedAuth={false} redirectTo="/feed">
        <Verification />
      </ProtectedRoute>
    ),
  },
  { path: "/feed", element: <Feed /> },
  { path: "/feed/from/:id", element: <Feed /> },
  {
    path: "/profile-user",
    element: (
      <ProtectedRoute allowedAuth={true} redirectTo="/feed">
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed-reactions",
    element: (
      <ProtectedRoute allowedAuth={true} redirectTo="/feed">
        <FeedReactions />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <PageNotFound /> },
]);

const showMainFramePadding = false;
export function App() {
  return (
    <Provider store={store}>
      <div
        className="mainframe"
        style={showMainFramePadding === false && { padding: "0px" }}
      >
        <Routers />
        <ToastContainer autoClose={1500} />
      </div>
    </Provider>
  );
}
