import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CircularProgress, Box, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Registration = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    if (formData.username) {
      // Check if username is available when it is typed
      axios.post('/users/me', { username: formData.username })
        .then(response => {
          if (response.data) {
            setUsernameAvailable(false);
            setUsernameError('Username already taken');
          } else {
            setUsernameAvailable(true);
            setUsernameError('');
          }
        })
        .catch(() => {
          setUsernameAvailable(null);
          setUsernameError('');
        });
    }
  }, [formData.username]);

  const handleRegister = () => {
    // Clear previous errors
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate the form
    if (!formData.password) {
      setPasswordError('Password is required');
    } else if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    }

    if (passwordError || confirmPasswordError) {
      return; // Prevent submission if there are errors
    }

    setLoading(true);
    axios.post('/user/register', formData)
      .then(res => {
        // Store username in a cookie after successful registration
        document.cookie = `username=${formData.username}; path=/; max-age=86400`; // Expires in 1 day

        setLoading(false);
        window.location.href = '/flights'; // Redirect to flights page
      })
      .catch(error => {
        setLoading(false);
        // Handle registration error here if needed
        console.error("Registration error:", error);
      });
  };

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',padding: 3 }}>
      <Typography variant="h4">Register</Typography>
      
      <TextField
        label="Full Name"
        fullWidth
        margin="normal"
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        value={formData.full_name}
      />
      
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        value={formData.username}
        error={usernameError.length > 0}
        helperText={usernameError || (usernameAvailable && 'Username is available')}
        InputProps={{
          endAdornment: usernameAvailable && (
            <InputAdornment position="end">
              <CheckCircleIcon color="success" />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        value={formData.email}
      />
      
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        value={formData.password}
        error={passwordError.length > 0}
        helperText={passwordError}
      />
      
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        value={formData.confirmPassword}
        error={confirmPasswordError.length > 0}
        helperText={confirmPasswordError}
      />
      
      <TextField
        label="Phone Number"
        fullWidth
        margin="normal"
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        value={formData.phone}
      />

      <Box my={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={usernameAvailable === false || !formData.password || formData.password !== formData.confirmPassword}
          >
            Register
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Registration;
