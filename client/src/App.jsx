import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Profile from "./components/Pages/Profile";
import Login from "./components/Authentication/Login";
import Navbar from "./components/Home/Navbar";
import Register from "./components/Authentication/Register";
import CreatePost from "./components/Home/CreatePost";
import Users from "./components/Home/Users";
import EditProfile from "./components/Pages/EditProfile";
import SavedPosts from "./components/Pages/SavedPosts";
import LikedPosts from "./components/Pages/LikedPosts";
import NotFound from "./components/Pages/NotFound"; // Import your custom 404 page component
import { MediaContext } from "./Context";

const PrivateRoute = ({ element: Component, authenticated, ...rest }) => {
  return authenticated ? (
    <>
      <Navbar />
      <Component {...rest} />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  const initialUserState = {
    userId: sessionStorage.getItem("userId") || "",
    username: sessionStorage.getItem("username") || "",
    email: sessionStorage.getItem("email") || "",
    profile: sessionStorage.getItem("profile") || "",
  };

  const [user, setUser] = useState(initialUserState);
  const isLoggedIn = !!user.userId;

  return (
    <>
      <ToastContainer />
      <MediaContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute element={Home} authenticated={isLoggedIn} />
              }
            />
            <Route
              path="/createpost"
              element={
                <PrivateRoute element={CreatePost} authenticated={isLoggedIn} />
              }
            />
            <Route
              path="/savedpost"
              element={
                <PrivateRoute element={SavedPosts} authenticated={isLoggedIn} />
              }
            />
            <Route
              path="/likedpost"
              element={
                <PrivateRoute element={LikedPosts} authenticated={isLoggedIn} />
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute element={Users} authenticated={isLoggedIn} />
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute element={Profile} authenticated={isLoggedIn} />
              }
            />
            <Route
              path="/editprofile/:userId"
              element={
                <PrivateRoute
                  element={EditProfile}
                  authenticated={isLoggedIn}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MediaContext.Provider>
    </>
  );
};

export default App;
