// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CircularProgress, Box } from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    axios.post('/user/login', credentials).then(res => {
      document.cookie = `username=${credentials.username}`;
      setLoading(false);
      window.location.href = '/';
    });
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <TextField label="Username" fullWidth margin="normal" onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
      <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
      <Box my={2}>
        {loading ? <CircularProgress /> : <Button variant="contained" onClick={handleLogin}>Login</Button>}
      </Box>
    </Container>
  );
};

export default Login;
