import React, { useContext, useEffect, useState } from "react";
import Post from "./Post";
import Suggestion from "./Users";
import axios from "axios";
import { MediaContext } from "../../Context";
import { AiFillCamera } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { CameraAltRounded } from "@mui/icons-material";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../baseURL";

const CreatePost = () => {
  const { user, setUser } = useContext(MediaContext);
  const [isPost, setIsPost] = useState(false);
  const [allPost, setAllPost] = useState();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [showSelectedImage, setShowSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [loadMore, setLoadMore] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(baseURL + `/api/getallposts/query?limit=${loadMore}`)
      .then((res) => {
        console.log(res);
        setAllPost(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isPost]);

  const handlePost = (e) => {
    setIsPosting(true);
    e.preventDefault();
    const userId = user.userId;

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    axios.post(baseURL + `/api/new/post/${userId}`, formData).then((res) => {
      if (res.data.success) {
        setIsPost(true);
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsPosting(false);
        navigate("/");
      } else {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsPosting(false);
      }
    });

    setIsPost(false);
    setCaption("");
    setImage(null);
    setShowSelectedImage(null);
  };

  return (
    <>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{ marginTop: 5 }}
      >
        <Grid item xs={6}>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Card
              sx={{
                boxShadow: 4,
              }}
            >
              <FormControl encType="multipart/form-data" sx={{ padding: 5 }}>
                <div className="text-center">
                  <input
                    type="file"
                    id="imageFile"
                    className="invisible w-full"
                    name="post"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      setShowSelectedImage(
                        URL.createObjectURL(e.target.files[0])
                      );
                    }}
                  />
                  <label htmlFor="imageFile">
                    <CameraAltRounded
                      sx={{
                        height: "100px",
                        width: "100px",
                        borderRadius: "100%",
                        padding: 1,
                        "&:hover": {
                          background: "#d9d9d9",
                          cursor: "pointer",
                        },
                      }}
                    />
                  </label>
                </div>

                <TextField
                  id="standard-basic"
                  label="caption"
                  variant="standard"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  {!isPosting ? (
                    <Button
                      fullWidth={true}
                      variant="contained"
                      type="submit"
                      onClick={handlePost}
                    >
                      Post Now
                    </Button>
                  ) : (
                    <CircularProgress />
                  )}
                </Box>
              </FormControl>
            </Card>
          </Container>
        </Grid>
        <Grid item xs={6}>
          <Container
            maxWidth="sm"
            sx={{
              marginTop: 10,
            }}
          >
            <Card>
              {showSelectedImage && (
                <CardMedia
                  component="img"
                  height="194"
                  alt="Remy Sharp"
                  image={showSelectedImage}
                  sx={{ width: "100%" }}
                />
              )}
            </Card>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default CreatePost;
