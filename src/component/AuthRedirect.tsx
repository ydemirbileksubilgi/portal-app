import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Box, CircularProgress, Typography } from "@mui/material";
import { clearAllAuthData } from "../hooks/useAuthCleanup";

const AuthRedirect: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string>("/login");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      const expiresAt = localStorage.getItem("expiresAt");

      if (token && user) {
        if (expiresAt) {
          const expirationDate = new Date(expiresAt);
          const currentDate = new Date();

          if (currentDate < expirationDate) {
            setRedirectTo("/quotation-my-step");
          } else {
            clearAllAuthData();
            setRedirectTo("/login");
          }
        } else {
          setRedirectTo("/quotation-my-step");
        }
      } else {
        setRedirectTo("/login");
      }

      setIsLoading(false);
    };

    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)",
          color: "white",
        }}
      >
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: "white",
            mb: 3,
          }}
        />
        <Typography variant="h6" fontWeight="500" sx={{ opacity: 0.9 }}>
          Yönlendiriliyor...
        </Typography>
      </Box>
    );
  }

  return <Navigate to={redirectTo} replace />;
};

export default AuthRedirect;
