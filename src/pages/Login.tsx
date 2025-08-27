import React, { useState } from 'react';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
  Avatar,
  Container,
  Fade,
  CircularProgress,
  Paper,
  Slide,
  Snackbar
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutline,
  Lock,
  ErrorOutline,
  CheckCircleOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormErrors {
  username?: string;
  password?: string;
}

interface User {
  userId: number;
  username: string;
  fullName: string;
  personId: number | null;
}

interface LoginResponse {
  success: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: User | null;
  errorMessage: string | null;
  authenticationMethod: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success' | 'info'>('error');

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // Kullanıcı adı validasyonu
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Kullanıcı adı en az 2 karakter olmalıdır';
    }

    // Şifre validasyonu
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Şifre en az 3 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message: string, severity: 'error' | 'success' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Hata mesajını temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Genel hata mesajını temizle
    if (loginError) {
      setLoginError('');
    }
  };

  const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('https://localhost:63085/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const result = await loginUser(formData.username, formData.password);
      
      if (result.success && result.token) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('refreshToken', result.refreshToken || '');
        localStorage.setItem('expiresAt', result.expiresAt || '');
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Başarılı giriş bildirimi
        showNotification(`Hoş geldiniz, ${result.user?.fullName || result.user?.username}!`, 'success');
        
        // Kısa bir gecikme ile ana sayfaya yönlendir
        setTimeout(() => {
          navigate('/quotation-all');
        }, 1500);
      } else {
        // API'den gelen hata mesajını göster
        const errorMsg = result.errorMessage || 'Giriş yapılırken bir hata oluştu';
        setLoginError(errorMsg);
        showNotification(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.';
      setLoginError(errorMsg);
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <>
      {/* Ana Container */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
          padding: { xs: 2, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cg fill=\\"none\\" fill-rule=\\"evenodd\\"%3E%3Cg fill=\\"%23ffffff\\" fill-opacity=\\"0.03\\"%3E%3Ccircle cx=\\"30\\" cy=\\"30\\" r=\\"3\\"/%%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={800}>
            <Paper
              elevation={24}
              sx={{
                width: '100%',
                maxWidth: 420,
                margin: '0 auto',
               
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
              }}
            >
              <CardContent sx={{ padding: { xs: 3, sm: 5 } }}>
                {/* Logo ve Başlık */}
                <Slide direction="down" in={true} timeout={600}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        margin: '0 auto',
                        bgcolor: 'transparent',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: 72,
                        height: 72,
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <LockOutlined sx={{ fontSize: 32, color: 'white' }} />
                    </Avatar>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      fontWeight="700" 
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}
                    >
                      Portal Giriş
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      Hesabınıza güvenli giriş yapın
                    </Typography>
                  </Box>
                </Slide>

                {/* Hata Mesajı */}
                {loginError && (
                  <Fade in={!!loginError} timeout={300}>
                    <Alert 
                      severity="error" 
                      icon={<ErrorOutline />}
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        border: '1px solid rgba(211, 47, 47, 0.2)',
                        background: 'rgba(253, 237, 237, 0.8)',
                        '& .MuiAlert-icon': {
                          fontSize: '1.2rem'
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight="500">
                        {loginError}
                      </Typography>
                    </Alert>
                  </Fade>
                )}

                {/* Login Formu */}
                <Slide direction="up" in={true} timeout={800}>
                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                      fullWidth
                      id="username"
                      label="Kullanıcı Adı"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      error={!!errors.username}
                      helperText={errors.username}
                      margin="normal"
                      required
                      autoComplete="username"
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          background: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            background: 'rgba(255, 255, 255, 0.9)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                            background: 'rgba(255, 255, 255, 1)'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: '500'
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      id="password"
                      label="Şifre"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      error={!!errors.password}
                      helperText={errors.password}
                      margin="normal"
                      required
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                              sx={{
                                color: 'action.active',
                                '&:hover': {
                                  color: 'primary.main'
                                }
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          background: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            background: 'rgba(255, 255, 255, 0.9)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                            background: 'rgba(255, 255, 255, 1)'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: '500'
                        }
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        mt: 4,
                        mb: 2,
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} color="inherit" />
                          <Typography>Giriş yapılıyor...</Typography>
                        </Box>
                      ) : (
                        'Giriş Yap'
                      )}
                    </Button>

                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        veya
                      </Typography>
                    </Divider>

                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="text"
                        color="primary"
                        sx={{ 
                          textTransform: 'none',
                          fontWeight: '500',
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.1)'
                          }
                        }}
                      >
                        Şifremi Unuttum
                      </Button>
                    </Box>
                  </Box>
                </Slide>
              </CardContent>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Snackbar Bildirimler */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          icon={snackbarSeverity === 'success' ? <CheckCircleOutline /> : <ErrorOutline />}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: '500'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;