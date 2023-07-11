import React, { useContext, useEffect, useState } from "react";
import { MediaContext } from "../../Context";
import axios from "axios";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Container,
  TextField,
  IconButton,
  OutlinedInput,
  CardActionArea,
  Avatar,
  CircularProgress,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { baseURL } from "../../baseURL";

const Users = () => {
  const { user, setUser } = useContext(MediaContext);
  const [whoToFollow, setWhoToFollow] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user.userId) return;

    axios.get(baseURL + "/api/userstofollow/" + user.userId).then((res) => {
      console.log(res);
      setWhoToFollow(res.data.users);
      setIsLoading(false);
    });
  }, [user]);

  const handleFollow = (followId) => {
    axios
      .put(baseURL + "/api/users/follow", {
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

    axios.get(baseURL + "/api/userstofollow/" + user.userId).then((res) => {
      setWhoToFollow(res.data.users);
    });
  };

  const handleSearchUser = (e) => {
    setSearchUser(e.target.value);
    axios
      .get(
        baseURL +
          "/api/searchuser/query?username=" +
          e.target.value.trim() +
          "&userId=" +
          user.userId
      )
      .then((res) => {
        console.log(res);
        setWhoToFollow(res.data);
      });
  };

  return (
    <>
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: 3,
            maxWidth: "500px",
            marginTop: 15,
            textAlign: "center",
            padding: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontSize: 24, fontFamily: "monospace" }}
          >
            USERS
          </Typography>
          <Box sx={{ marginTop: 2, color: "black" }}>
            <OutlinedInput
              value={searchUser}
              onChange={(e) => handleSearchUser(e)}
              placeholder="search user.."
              fullWidth={true}
              color="primary"
              id="outlined-basic"
              endAdornment={
                <IconButton>
                  <SearchRoundedIcon />
                </IconButton>
              }
            />
          </Box>
          <CardContent>
            {isLoading ? (
              <CircularProgress color="primary" thickness={6} size={100} />
            ) : (
              <>
                {whoToFollow &&
                  whoToFollow.map((person, index) => {
                    return (
                      <Card
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 1,
                          boxShadow: 0,
                        }}
                        key={index}
                      >
                        <Link to={`/profile/${person._id}`}>
                          <div className="flex items-center text-center">
                            <Avatar
                              src={`${baseURL}/${person.profilePicURL}`}
                              sx={{ marginRight: 2 }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ cursor: "pointer" }}
                            >
                              {person.username}
                            </Typography>
                          </div>
                        </Link>

                        {person.isCurrentUser ? (
                          <Button variant="contained" disabled={true}>
                            It's Me
                          </Button>
                        ) : (
                          <>
                            {person.isFollowed ? (
                              <Button variant="contained" disabled={true}>
                                Following
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={() => handleFollow(person._id)}
                              >
                                Follow
                              </Button>
                            )}
                          </>
                        )}
                      </Card>
                    );
                  })}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Users;
