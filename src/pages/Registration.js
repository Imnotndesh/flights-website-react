// src/pages/Registration.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CircularProgress, Box } from '@mui/material';

const Registration = () => {
  const [formData, setFormData] = useState({ fullname: '', username: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    axios.post('/user/register', formData).then(res => {
      document.cookie = `username=${formData.username}`;
      setLoading(false);
      window.location.href = '/';
    });
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      <TextField label="Full Name" fullWidth margin="normal" onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
      <TextField label="Username" fullWidth margin="normal" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
      <TextField label="Email" fullWidth margin="normal" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <TextField label="Password" type="password" fullWidth margin="normal" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <TextField label="Confirm Password" type="password" fullWidth margin="normal" onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
      <TextField label="Phone Number" fullWidth margin="normal" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
      <Box my={2}>
        {loading ? <CircularProgress /> : <Button variant="contained" onClick={handleRegister}>Register</Button>}
      </Box>
    </Container>
  );
};

export default Registration;
