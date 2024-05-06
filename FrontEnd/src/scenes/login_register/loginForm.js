import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './loginForm.css';

const LoginForm = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password); 
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-form-container"> 
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="login-form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          m: 'auto',
          p: theme.spacing(3),
          backgroundColor: theme.palette.background.paper,
          borderRadius: '8px',
          boxShadow: theme.shadows[5],
        }}
      >
        <Typography variant="h6" textAlign="center" className="login-title">
          Bem-vindo!
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth>
          Entrar
        </Button>
      </Box>
    </div>
  );
};

export default LoginForm;
