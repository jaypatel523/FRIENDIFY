import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MediaContext } from "../../Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import TextsmsRoundedIcon from "@mui/icons-material/TextsmsRounded";
import TurnedInRoundedIcon from "@mui/icons-material/TurnedInRounded";
import TurnedInNotRoundedIcon from "@mui/icons-material/TurnedInNotRounded";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import {
  IconButton,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  Container,
  Box,
  FormControl,
  TextField,
  Divider,
  InputBase,
  List,
  ListItem,
  ListItemText,
  DialogContent,
  CardActionArea,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DeleteForeverRounded } from "@mui/icons-material";
import { baseURL } from "../../baseURL";

const EachSavePost = ({ post, savedPosts, setSavedPosts }) => {
  const { user, setUser } = useContext(MediaContext);
  const { text, imageUrl } = post;
  const [isLiked, setIsLiked] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [numberOfComments, setNumberOfComments] = useState(0);

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [scroll]);

  useEffect(() => {
    if (!user.userId) return;
    axios
      .get(baseURL + "/api/post/isLike/" + post._id + "/" + user.userId)
      .then((res) => {
        setIsLiked(res.data.success);
      });
  }, [savedPosts]);

  useEffect(() => {
    if (!user.userId) return;
    axios
      .get(baseURL + "/api/post/isSave/" + user.userId + "/" + post._id)
      .then((res) => {
        setIsPostSaved(res.data.success);
      });
  }, [savedPosts]);

  useEffect(() => {
    if (!user.userId) return;
    axios.get(baseURL + "/api/getLikesAndComments/" + post._id).then((res) => {
      setNumberOfLikes(res.data.likesAndComments.likes.length);
      setNumberOfComments(res.data.likesAndComments.comments.length);
    });
  }, [isPostSaved]);

  const handleLike = () => {
    axios
      .put(baseURL + "/api/posts/like", {
        userId: user.userId,
        postId: post._id,
      })
      .then((res) => {
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
        setIsLiked(true);
      })
      .catch((err) => {
        setIsLiked(false);
        console.log("err", err);
      });

    axios.get(baseURL + "/api/getLikesAndComments/" + post._id).then((res) => {
      setNumberOfLikes(res.data.likesAndComments.likes.length);
      setNumberOfComments(res.data.likesAndComments.comments.length);
    });
  };

  const handleUnLike = () => {
    axios
      .put(baseURL + "/api/posts/unlike", {
        userId: user.userId,
        postId: post._id,
      })
      .then((res) => {
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
        setIsLiked(false);
      })
      .catch((err) => {
        console.log("err", err);
      });

    axios.get(baseURL + "/api/getLikesAndComments/" + post._id).then((res) => {
      setNumberOfLikes(res.data.likesAndComments.likes.length);
      setNumberOfComments(res.data.likesAndComments.comments.length);
    });
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/api/posts/getcomments/${post._id}`)
      .then((res) => {
        setComments(res.data[0].comments);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the comments container when a new comment is added
    const commentsContainer = document.getElementById("comments-container");
    if (commentsContainer) {
      commentsContainer.scrollTop = commentsContainer.scrollHeight;
    }
  }, [comments]);

  // console.log(comments);

  const handleComment = (e) => {
    e.preventDefault();

    if (commentText.trim().length == 0) return;

    const data = {
      userId: user.userId,
      comment: commentText,
      postId: post._id,
    };
    axios
      .put(baseURL + "/api/posts/comment", data)
      .then((res) => {
        setComments(res.data.result.comments);
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
      })
      .catch((err) => {
        console.log(err);
      });
    setCommentText("");

    axios.get(baseURL + "/api/getLikesAndComments/" + post._id).then((res) => {
      setNumberOfLikes(res.data.likesAndComments.likes.length);
      setNumberOfComments(res.data.likesAndComments.comments.length);
    });
  };

  const handleUnComment = (commentId) => {
    const data = {
      commentId: commentId,
      postId: post._id,
    };
    axios
      .put(baseURL + "/api/posts/uncomment", data)
      .then((res) => {
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
        setComments(res.data.result.comments);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(baseURL + "/api/getLikesAndComments/" + post._id).then((res) => {
      setNumberOfLikes(res.data.likesAndComments.likes.length);
      setNumberOfComments(res.data.likesAndComments.comments.length);
    });
  };

  const handleSavePost = () => {
    axios
      .put(baseURL + "/api/post/save/" + user.userId + "/" + post._id)
      .then((res) => {
        if (res.data.success) {
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
          setIsPostSaved(true);
        }
      });
  };

  const handleUnSavePost = () => {
    axios
      .put(baseURL + "/api/post/unsave/" + user.userId + "/" + post._id)
      .then((res) => {
        if (res.data.success) {
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

          axios.get(baseURL + "/api/post/saved/" + user.userId).then((res) => {
            setSavedPosts(res.data.savePosts);
            setIsPostSaved(false);
          });
        }
      });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {/* <div className="mb-20 mobile:text-center text-base bg-gray-200"> */}
      <Card sx={{ fontSize: "16px", boxShadow: 2 }}>
        <CardContent
          sx={{
            padding: 1,
            textAlign: "start",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src={`${baseURL}/${post.postedBy.profilePicURL}`}
            sx={{ marginRight: 2 }}
          />
          <Typography variant="overline" sx={{ fontWeight: "bold" }}>
            {post.postedBy.username}
          </Typography>
        </CardContent>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ border: "1px solid black" }}
        >
          <Container maxWidth="xl">
            <img src={`${baseURL}/${imageUrl}`} />
          </Container>
        </Dialog>

        <CardActionArea onClick={handleOpenDialog}>
          {/* <CardMedia
            component="img"
            image={`http://localhost:8000/${imageUrl}`}
            alt="green iguana"
          /> */}
          <img
            src={`${baseURL}/${imageUrl}`}
            className="w-full h-72 object-contain"
          />
        </CardActionArea>

        <CardContent sx={{ textAlign: "start", padding: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: "16px", fontFamily: "monospace" }}
          >
            {text}
          </Typography>
        </CardContent>
        <div className="flex justify-between mb-2 px-2">
          <div className="flex justify-between text-center items-center">
            {isLiked ? (
              <>
                <IconButton onClick={handleUnLike}>
                  <ThumbUpRoundedIcon />
                </IconButton>
                <Typography variant="body1" sx={{ fontFamily: "serif" }}>
                  {numberOfLikes} likes
                </Typography>
              </>
            ) : (
              <>
                <IconButton onClick={handleLike}>
                  <ThumbUpOutlinedIcon />
                </IconButton>
                <Typography variant="body1" sx={{ fontFamily: "serif" }}>
                  {numberOfLikes} likes
                </Typography>
              </>
            )}

            <IconButton
              onClick={() => {
                setIsCommentOpen(true);
              }}
            >
              <TextsmsRoundedIcon />
            </IconButton>
          </div>
          {isPostSaved ? (
            <>
              <IconButton onClick={handleUnSavePost}>
                <TurnedInRoundedIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={handleSavePost}>
                <TurnedInNotRoundedIcon />
              </IconButton>
            </>
          )}
        </div>

        <Dialog open={isCommentOpen}>
          <Card
            sx={{
              width: "600px",
              height: "1000px",
              padding: 4,
            }}
          >
            <Box
              variant="outlined"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h5" sx={{ fontFamily: "cursive" }}>
                Comments ({numberOfComments})
              </Typography>
              <IconButton onClick={() => setIsCommentOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginRight: 1,
              }}
            >
              <InputBase
                fullWidth={true}
                placeholder="Comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ fontFamily: "cursive" }}
              />
              <IconButton onClick={(e) => handleComment(e)}>
                <SendIcon />
              </IconButton>
            </Box>

            <Divider />

            <Box
              id="comments-container"
              className="overflow-y-scroll max-h-[500px]"
            >
              {comments &&
                comments.map((comment, index) => {
                  return (
                    <div key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginRight: 1,
                        }}
                      >
                        <Typography
                          variant="overline"
                          sx={{
                            fontWeight: "bold",
                            "&:hover": { cursor: "pointer" },
                            fontFamily: "monospace",
                            margin: 0,
                          }}
                        >
                          {comment.commentedBy?.username}
                        </Typography>
                        <IconButton
                          onClick={() => handleUnComment(comment._id)}
                        >
                          <DeleteForeverRounded />
                        </IconButton>
                      </Box>
                      <Typography
                        sx={{
                          textAlign: "justify",
                          fontFamily: "monospace",
                          marginRight: 2,
                        }}
                      >
                        {comment?.text}
                      </Typography>
                      <Divider
                        variant="fullWidth"
                        sx={{
                          border: "1px solid black",
                          marginY: 2,
                          marginRight: 2,
                        }}
                      />
                    </div>
                  );
                })}
            </Box>
          </Card>
        </Dialog>
      </Card>
    </>
  );
};

export default EachSavePost;
