import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import Profile from "./components/Pages/Profile";
import EditProfile from "./components/Pages/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
  },
  {
    path: "/editprofile",
    element: <EditProfile />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
