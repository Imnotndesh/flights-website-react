// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    setLoading(true);
    axios.post('/user/login', credentials)
      .then(res => {
        if (res.status === 200) {
          // Set cookie and redirect to /flights if login is successful
          document.cookie = `username=${credentials.username}`;
          window.location.href = '/flights';
        }
      })
      .catch(error => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          // Show error dialog if status is 401 (invalid password)
          setErrorMessage('Invalid username or password. Please try again.');
          setErrorDialogOpen(true);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
          setErrorDialogOpen(true);
        }
      });
  };

  const handleCloseDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',padding:3}}>
      <Typography variant="h4">Login</Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <Box my={2}>
        {loading ? <CircularProgress /> : <Button variant="contained" onClick={handleLogin}>Login</Button>}
      </Box>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;