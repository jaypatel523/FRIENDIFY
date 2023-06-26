import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { MediaContext } from "../../Context";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PostTab from "./PostTab";
import FollowerTab from "./FollowerTab";
import FollowingTab from "./FollowingTab";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { user } = useContext(MediaContext);
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState();
  const [followings, setFollowings] = useState();
  const [followers, setFollowers] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [whoToFollow, setWhoToFollow] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const params = useParams();

  const onTabChange = (event, value) => {
    setTabValue(value);
  };

  useEffect(() => {
    axios
      .get(
        "https://socialmedia-4z35.onrender.com/api/getposts/" + params.userId
      )
      .then((res) => {
        setPosts(res.data);
        setIsProfileLoading(false);
      });

    axios
      .get(
        "https://socialmedia-4z35.onrender.com/api/getfollowerandfollowing/" +
          params.userId
      )
      .then((res) => {
        // setFollowers(res.data.followings);
        setFollowers(res.data.followers);
        setFollowings(res.data.following);
        setIsProfileLoading(false);
      });
  }, [params]);

  useEffect(() => {
    axios
      .get(
        "https://socialmedia-4z35.onrender.com/api/getuserdetails/" +
          params.userId
      )
      .then((res) => {
        setCurrentUser(res.data.user);
        setProfilePic(
          "https://socialmedia-4z35.onrender.com/" + res.data.user.profilePicURL
        );
        setIsProfileLoading(false);
      });
  }, [params]);

  useEffect(() => {
    axios
      .post("https://socialmedia-4z35.onrender.com/api/user/isfollowing", {
        userId: user.userId,
        followId: params.userId,
      })
      .then((res) => {
        setIsFollowing(res.data.success);
      });
  }, [isFollowing]);

  const handleFollow = () => {
    axios
      .put("https://socialmedia-4z35.onrender.com/api/users/follow", {
        userId: user.userId,
        followId: params.userId,
      })
      .then((res) => {
        toast.success("You are following " + res.data.username, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsFollowing(true);
      });
  };

  return (
    <div>
      {isProfileLoading ? (
        <Box
          sx={{
            marginTop: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" thickness={6} size={100} />
        </Box>
      ) : (
        <>
          <Container
            maxWidth="md"
            sx={{ marginTop: 15, padding: 4, boxShadow: 2 }}
          >
            <Grid container spacing={4} textAlign="center">
              <Grid
                item
                xs={5}
                sx={{
                  display: "flex",
                  alignItems: "start",
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
                  sx={{ width: 200, height: 200, objectFit: "fill" }}
                />
              </Grid>
              <Grid item textAlign="center">
                <Typography
                  variant="h5"
                  noWrap
                  sx={{
                    marginBottom: 2,
                    fontFamily: "monospace",
                  }}
                >
                  {currentUser?.username}
                </Typography>
                <Card
                  sx={{
                    boxShadow: 0,
                    marginBottom: 3,
                  }}
                >
                  <Grid
                    container
                    spacing={6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item>
                      <Typography>{posts?.length}</Typography>
                      <Typography sx={{ fontWeight: "bold" }}>Posts</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>{followings?.length}</Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Following
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography>{followers?.length}</Typography>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Followers
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
                <Card sx={{ boxShadow: 0, textAlign: "start" }}>
                  {params.userId === user.userId ? (
                    <Button
                      variant="contained"
                      sx={{ width: "100%" }}
                      onClick={() => navigate("/editprofile/" + user.userId)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      {!isFollowing ? (
                        <Button
                          variant="contained"
                          sx={{ width: "100%" }}
                          onClick={handleFollow}
                        >
                          Follow
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          sx={{ width: "100%", backgroundColor: "lightgray" }}
                          disabled={true}
                        >
                          Following
                        </Button>
                      )}
                    </>
                  )}
                </Card>

                <Card
                  sx={{
                    boxShadow: 0,
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={onTabChange}
                    aria-label="icon label tabs example"
                  >
                    <Tab label="POSTS" />
                    <Tab label="FOLLOWERS" />
                    <Tab label="FOLLOWING" />
                  </Tabs>
                </Card>
              </Grid>
            </Grid>
          </Container>

          {tabValue === 0 && (
            <>
              {posts && posts.length === 0 && (
                <>
                  <Box
                    sx={{
                      textAlign: "center",
                      fontFamily: "monospace",
                      letterSpacing: 2,
                      fontSize: 30,
                      width: "100%",
                      color: "darkgray",
                      marginTop: 5,
                    }}
                  >
                    No Posts...
                  </Box>
                </>
              )}
              <Container maxWidth="md" sx={{ marginY: 5 }}>
                <PostTab posts={posts} />
              </Container>
            </>
          )}

          {tabValue === 1 && (
            <>
              {followers && followers.length === 0 && (
                <>
                  <Box
                    sx={{
                      textAlign: "center",
                      fontFamily: "monospace",
                      letterSpacing: 2,
                      fontSize: 30,
                      width: "100%",
                      color: "darkgray",
                      marginTop: 5,
                    }}
                  >
                    No Followers...
                  </Box>
                </>
              )}
              <Container maxWidth="sm" sx={{ marginY: 5, boxShadow: 4 }}>
                <FollowerTab
                  followers={followers}
                  setFollowers={setFollowers}
                  setFollowings={setFollowings}
                />
              </Container>
            </>
          )}

          {tabValue === 2 && (
            <>
              {followings && followings.length === 0 && (
                <>
                  <Box
                    sx={{
                      textAlign: "center",
                      fontFamily: "monospace",
                      letterSpacing: 2,
                      fontSize: 30,
                      width: "100%",
                      marginTop: 5,
                      color: "darkgray",
                    }}
                  >
                    No Followings...
                  </Box>
                </>
              )}
              <Container maxWidth="sm" sx={{ marginY: 5, boxShadow: 4 }}>
                <FollowingTab
                  followings={followings}
                  setFollowings={setFollowings}
                  currentUser={currentUser}
                />
              </Container>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
