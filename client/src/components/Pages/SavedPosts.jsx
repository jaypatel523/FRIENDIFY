import { Box, CircularProgress, Container, Grid } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MediaContext } from "../../Context";
import EachSavePost from "./EachSavePost";

const SavedPosts = () => {
  const { user } = useContext(MediaContext);
  const [savedPosts, setSavedPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user.userId) return;
    axios
      .get(
        "https://socialmedia-4z35.onrender.com/api/post/saved/" + user.userId
      )
      .then((res) => {
        console.log(res);
        setSavedPosts(res.data.savePosts);
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
            {savedPosts && savedPosts.length === 0 && (
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

            {savedPosts &&
              savedPosts.map((post, index) => {
                return (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                    <EachSavePost
                      post={post}
                      savedPosts={savedPosts}
                      setSavedPosts={setSavedPosts}
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

export default SavedPosts;
