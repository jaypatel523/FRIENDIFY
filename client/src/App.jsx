import React, { useEffect, useState } from "react";
import router from "./router";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { MediaContext } from "./Context";
import { ToastContainer, toast } from "react-toastify";
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

const App = () => {
  const [user, setUser] = useState({
    userId: "",
    username: "",
    email: "",
    profile: "",
  });

  useEffect(() => {
    setUser({
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("username"),
      email: sessionStorage.getItem("email"),
      profile: sessionStorage.getItem("profile"),
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <MediaContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/"
              element={
                user.userId ? (
                  <>
                    <Navbar />
                    <Home />
                  </>
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/createpost"
              element={
                <>
                  <Navbar />
                  <CreatePost />
                </>
              }
            />
            <Route
              path="/savedpost"
              element={
                <>
                  <Navbar />
                  <SavedPosts />
                </>
              }
            />
            <Route
              path="/likedpost"
              element={
                <>
                  <Navbar />
                  <LikedPosts />
                </>
              }
            />
            <Route
              path="/users"
              element={
                <>
                  <Navbar />
                  <Users />
                </>
              }
            />

            <Route
              path="/profile/:userId"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />
            <Route
              path="/editprofile/:userId"
              element={
                <>
                  <Navbar />
                  <EditProfile />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </MediaContext.Provider>
    </>
  );
};

export default App;
