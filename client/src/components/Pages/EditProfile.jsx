import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { MediaContext } from "../../Context";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState();
  const { user, setUser } = useContext(MediaContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    axios
      .get(
        "https://socialmedia-4z35.onrender.com/api/getuserdetails/" +
          params.userId
      )
      .then((res) => {
        setUsername(res.data.user.username);
        setEmail(res.data.user.email);
        setProfilePic(
          "https://socialmedia-4z35.onrender.com/" + res.data.user.profilePicURL
        );
        setIsLoading(false);
      });
  }, []);

  const handleEditProfile = () => {
    const formData = new FormData();
    formData.append("userId", user.userId);
    formData.append("username", username);
    formData.append("email", email);
    if (image !== user.profile) formData.append("image", image);

    console.log(image);

    axios
      .post("https://socialmedia-4z35.onrender.com/api/editprofile", formData)
      .then((res) => {
        console.log(res);

        sessionStorage.setItem("userId", res.data._id);
        sessionStorage.setItem("username", res.data.username);
        sessionStorage.setItem("email", res.data.email);
        sessionStorage.setItem("profile", res.data.profilePicURL);

        setUser({
          userId: res.data._id,
          username: res.data.username,
          email: res.data.email,
          profile: res.data.profilePicURL,
        });

        toast.success("Your profile is updated", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        navigate("/profile/" + user.userId);
      });
  };

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          marginTop: 15,
          padding: 4,
          boxShadow: 4,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="primary" thickness={6} size={100} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                variant="circular"
                src={
                  profilePic
                    ? profilePic
                    : "../../../assets/default_profile.jpeg"
                }
                sx={{
                  width: 200,
                  height: 200,
                  objectFit: "fill",
                  marginRight: 5,
                }}
              />
              <div className="text-center">
                <input
                  type="file"
                  id="imageFile"
                  className="invisible hidden"
                  name="post"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setProfilePic(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <label
                  htmlFor="imageFile"
                  className="hover:bg-gray-200 cursor-pointer p-2 flex items-center justify-center rounded-3xl"
                >
                  <EditIcon sx={{ width: 30, height: 30 }} />
                </label>
              </div>
            </Box>

            <Box
              maxWidth={800}
              sx={{
                margin: "auto",
                padding: 4,
              }}
            >
              <TextField
                fullWidth={true}
                required
                id="username"
                label="Username"
                sx={{ marginY: 2 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth={true}
                required
                id="email"
                label="Email"
                sx={{ marginY: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleEditProfile}
                fullWidth={true}
                sx={{ marginY: 2 }}
              >
                Edit Profile
              </Button>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default EditProfile;
