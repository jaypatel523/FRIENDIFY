import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MediaContext } from "../../Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FollowerTab = ({ followers, setFollowers, setFollowings }) => {
  const { user } = useContext(MediaContext);
  const handleFollow = (followId) => {
    axios
      .put("https://socialmedia-4z35.onrender.com/api/users/follow", {
        userId: user.userId,
        followId,
      })
      .then((res) => {
        console.log(res);
        toast.success("You are following " + res.data.result.username, {
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
      .get(
        "https://socialmedia-4z35.onrender.com/api/getfollowerandfollowing/" +
          user.userId
      )
      .then((res) => {
        setFollowers(res.data.followers);
        setFollowings(res.data.following);
      });
  };

  return (
    <>
      {followers &&
        followers.map((follower, index) => {
          const [isFollowing, setIsFollowing] = useState(false);
          useEffect(() => {
            axios
              .post(
                "https://socialmedia-4z35.onrender.com/api/user/isfollowing",
                {
                  userId: user.userId,
                  followId: follower._id,
                }
              )
              .then((res) => {
                setIsFollowing(res.data.success);
              });
          }, [followers]);

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
                <Link to={`/profile/${follower._id}`}>
                  <div className="flex items-center text-center">
                    <Avatar
                      src={`https://socialmedia-4z35.onrender.com/${follower.profilePicURL}`}
                      sx={{ marginRight: 2 }}
                    />
                    <Typography variant="subtitle1" sx={{ cursor: "pointer" }}>
                      {follower.username}
                    </Typography>
                  </div>
                </Link>
                {follower._id === user.userId ? (
                  <>
                    <Button variant="contained">Me</Button>
                  </>
                ) : (
                  <>
                    {isFollowing ? (
                      <Button variant="contained" disabled={true}>
                        Following
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleFollow(follower._id)}
                      >
                        Follow
                      </Button>
                    )}
                  </>
                )}
              </Card>
              <Divider />
            </Box>
          );
        })}
    </>
  );
};

export default FollowerTab;
