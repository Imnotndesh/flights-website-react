// src/pages/LandingPage.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';

const LandingPage = () => (
  <Container maxWidth="md">
    <Box my={5} textAlign="center">
      <Typography variant="h4">Welcome to Airplane Booking</Typography>
    </Box>
    <Grid container spacing={4}>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Low Prices</Typography>
        <Typography>Enjoy affordable rates for flights around the world.</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Reliable Service</Typography>
        <Typography>Book flights with confidence and ease.</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">24/7 Support</Typography>
        <Typography>Our support team is here to assist you anytime.</Typography>
      </Grid>
    </Grid>
  </Container>
);

export default LandingPage;
