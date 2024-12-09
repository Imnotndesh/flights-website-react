// src/pages/Contacts.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const Contacts = () => (
  <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Typography variant="h4">Contact Us</Typography>
    <Typography>Email: support@airplanebooking.com</Typography>
    <Typography>Phone: +1-800-555-BOOK</Typography>
  </Container>
);

export default Contacts;
