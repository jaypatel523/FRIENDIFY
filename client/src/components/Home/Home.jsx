import React, { useContext, useEffect, useState } from "react";
import { MediaContext } from "../../Context";
import axios from "axios";
import Post from "./Post";
import { Box, Button, CircularProgress, Container, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Home = () => {
  const { user, setUser } = useContext(MediaContext);
  const [allPost, setAllPost] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(6);

  useEffect(() => {
    axios
      .get(`/api/getallposts/query?limit=${loadMore}&userId=${user.userId}`)
      .then((res) => {
        console.log(res);
        setAllPost(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setUser({
      userId: sessionStorage.getItem("userId"),
      username: sessionStorage.getItem("username"),
      email: sessionStorage.getItem("email"),
      profile: sessionStorage.getItem("profile"),
    });
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setLoadMore(loadMore + 6);
    axios
      .get(`/api/getallposts/query?limit=${loadMore + 6}&userId=${user.userId}`)
      .then((res) => {
        console.log(res);
        setAllPost(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <CircularProgress color="primary" thickness={6} size={100} />
        </Box>
      ) : (
        <Container sx={{ textAlign: "center" }}>
          <Box sx={{ flexGrow: 1, marginTop: 15 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {allPost &&
                allPost.map((post, index) => {
                  return (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <Post post={post} />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
          <Button
            variant="contained"
            fullWidth={true}
            endIcon={<ExpandMoreIcon />}
            sx={{ marginTop: 5, marginBottom: 10 }}
            onClick={handleLoadMore}
          >
            Load More...
          </Button>
        </Container>
      )}
    </>
  );
};

export default Home;
