import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MediaContext } from "../../Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../baseURL";

// TODO remove, this demo shouldn't need to reset the theme.

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  const { user, setUser } = useContext(MediaContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { email, password };
    axios.post(baseURL + "/api/auth/signin", data).then((res) => {
      console.log(res);
      if (res.data.user) {
        sessionStorage.setItem("userId", res.data.user._id);
        sessionStorage.setItem("username", res.data.user.username);
        sessionStorage.setItem("email", res.data.user.email);
        sessionStorage.setItem("profile", res.data.user.profilePic);
        setUser({
          userId: res.data.user._id,
          username: res.data.user.username,
          email: res.data.user.email,
          profile: res.data.user.profilePic,
        });
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
        navigateTo("/");
      } else {
        toast.warning(res.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });
  };

  return (
    <div className="h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center">
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 8,
            boxShadow: 4,
            background: "white",
            borderRadius: 2,
          }}
        >
          <Avatar variant="circular" sx={{ m: 1, backgroundColor: "#1665b0" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontFamily: "monospace" }}
          >
            Friendify Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Typography
              color="#1665b5"
              sx={{ textAlign: "center", textDecoration: "underline" }}
            >
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Typography>
          </Box>
        </Box>{" "}
      </Container>
    </div>
  );
};

export default Login;
