import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MediaContext } from "../../Context";
import { baseURL } from "../../baseURL";

const FollowingTab = ({ followings, setFollowings, currentUser }) => {
  //   console.log(currentUser);

  const { user } = useContext(MediaContext);
  const handleUnFollow = (unfollowId) => {
    axios
      .put(baseURL + "/api/users/unfollow", {
        userId: user.userId,
        unfollowId,
      })
      .then((res) => {
        toast.success("You Unfollow " + res.data.username, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });

    axios
      .get(baseURL + "/api/getfollowerandfollowing/" + user.userId)
      .then((res) => {
        setFollowings(res.data.following);
      });
  };

  return (
    <>
      {followings &&
        followings.map((following, index) => {
          return (
            <Box key={index}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingY: 2,
                  boxShadow: 0,
                }}
                key={index}
              >
                <Link to={`/profile/${following._id}`}>
                  <div className="flex items-center text-center">
                    <Avatar
                      src={`${baseURL}/${following.profilePicURL}`}
                      sx={{ marginRight: 2 }}
                    />
                    <Typography variant="subtitle1" sx={{ cursor: "pointer" }}>
                      {following.username}
                    </Typography>
                  </div>
                </Link>
                {user.userId === following._id ? (
                  <Button variant="contained">Me</Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleUnFollow(following._id)}
                  >
                    UnFollow
                  </Button>
                )}
              </Card>
              <Divider />
            </Box>
          );
        })}
    </>
  );
};

export default FollowingTab;
