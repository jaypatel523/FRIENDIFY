import { Box, CircularProgress, Container, Grid } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MediaContext } from "../../Context";
import EachLikePost from "./EachLikePost";

const LikedPosts = () => {
  const { user } = useContext(MediaContext);
  const [likedPosts, setLikedPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user.userId) return;
    axios
      .get(
        "https://socialmedia-4z35.onrender.com/api/posts/liked/" + user.userId
      )
      .then((res) => {
        setLikedPosts(res.data.likedPost);
        setIsLoading(false);
      });
  }, [user]);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" thickness={6} size={100} />
        </Box>
      )}
      <Container>
        <Box sx={{ flexGrow: 1, marginY: 15 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {likedPosts && likedPosts.length === 0 && (
              <>
                <Box
                  sx={{
                    textAlign: "center",
                    fontFamily: "monospace",
                    letterSpacing: 2,
                    fontSize: 30,
                    width: "100%",
                    color: "darkgray",
                  }}
                >
                  No Post Found...
                </Box>
              </>
            )}

            {likedPosts &&
              likedPosts.map((post, index) => {
                return (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                    <EachLikePost
                      post={post}
                      likedPosts={likedPosts}
                      setLikedPosts={setLikedPosts}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default LikedPosts;
