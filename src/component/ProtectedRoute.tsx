import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { clearAllAuthData } from '../hooks/useAuthCleanup';
import { Shield as ShieldIcon } from '@mui/icons-material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface User {
  userId: number;
  username: string;
  fullName: string;
  personId: number | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = (): boolean => {
    try {
      // Token kontrolü
      const token = localStorage.getItem('authToken');
      const expiresAt = localStorage.getItem('expiresAt');
      const userString = localStorage.getItem('user');

      // Temel kontroller
      if (!token || !userString) {
        console.log('Auth check failed: Missing token or user data');
        return false;
      }

      // Kullanıcı verisi parse edilebilir mi kontrol et
      let user: User;
      try {
        user = JSON.parse(userString);
        if (!user || !user.userId || !user.username) {
          console.log('Auth check failed: Invalid user data');
          return false;
        }
      } catch (error) {
        console.log('Auth check failed: Error parsing user data', error);
        return false;
      }

      // Token süresi kontrolü
      if (expiresAt) {
        const expirationDate = new Date(expiresAt);
        const currentDate = new Date();
        
        if (currentDate >= expirationDate) {
          console.log('Auth check failed: Token expired');
          // Süresi dolmuş token'ları temizle
          clearAllAuthData();
          return false;
        }
      }

      console.log('Auth check passed for user:', user.fullName || user.username);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  useEffect(() => {
    // Kısa bir gecikme ile auth kontrolü yap (loading effect için)
    const timer = setTimeout(() => {
      const authStatus = checkAuthentication();
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Loading durumu
  if (isLoading || isAuthenticated === null) {
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
        <Fade in={true} timeout={600}>
          <Box sx={{ textAlign: 'center' }}>
            <ShieldIcon 
              sx={{ 
                fontSize: 60, 
                mb: 3,
                opacity: 0.8,
                animation: 'pulse 2s infinite'
              }} 
            />
            <CircularProgress 
              size={50} 
              thickness={4}
              sx={{ 
                color: 'white',
                mb: 3,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Typography variant="h6" fontWeight="500" sx={{ opacity: 0.9 }}>
              Kimlik doğrulanıyor...
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              Lütfen bekleyin
            </Typography>
          </Box>
        </Fade>
        
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.8; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
              100% { opacity: 0.8; transform: scale(1); }
            }
          `}
        </style>
      </Box>
    );
  }

  // Kimlik doğrulaması başarısızsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kimlik doğrulaması başarılıysa içeriği göster
  return <>{children}</>;
};

export default ProtectedRoute;
