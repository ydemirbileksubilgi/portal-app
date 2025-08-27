import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthRedirect: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string>('/login');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      const expiresAt = localStorage.getItem('expiresAt');

      // Token ve user bilgisi varsa ve süresi dolmamışsa ana sayfaya yönlendir
      if (token && user) {
        if (expiresAt) {
          const expirationDate = new Date(expiresAt);
          const currentDate = new Date();
          
          if (currentDate < expirationDate) {
            setRedirectTo('/quotation-all');
          } else {
            // Token süresi dolmuş, temizle
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expiresAt');
            localStorage.removeItem('user');
            setRedirectTo('/login');
          }
        } else {
          // Expiration bilgisi yoksa ana sayfaya yönlendir
          setRedirectTo('/quotation-all');
        }
      } else {
        setRedirectTo('/login');
      }

      setIsLoading(false);
    };

    // Kısa bir gecikme ile kontrol et
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
          color: 'white'
        }}
      >
        <CircularProgress 
          size={50} 
          thickness={4}
          sx={{ 
            color: 'white',
            mb: 3
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
