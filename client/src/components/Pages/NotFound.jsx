import { Box, Button, Card, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 4,
        }}
      >
        <Card sx={{ textAlign: "center", boxShadow: 0, padding: 5 }}>
          <Typography variant="h1" style={{ color: "#1665b5" }}>
            404
          </Typography>
          <Typography variant="h6" style={{ color: "#1665b5" }}>
            The page you’re looking for doesn’t exist.
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: 5 }}
            onClick={() => {
              navigate("/");
            }}
          >
            Back Home
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default NotFound;
