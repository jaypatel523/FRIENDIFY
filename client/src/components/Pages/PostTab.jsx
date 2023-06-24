import React, { useContext, useEffect, useState } from "react";
import Post from "../Home/Post";
import { Box, Container, Grid } from "@mui/material";
import { MediaContext } from "../../Context";
import axios from "axios";

const PostTab = ({ posts }) => {
  const { user, setUser } = useContext(MediaContext);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {posts &&
            posts.map((post, index) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <Post post={post} />
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </>
  );
};

export default PostTab;
