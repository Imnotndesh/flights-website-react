// src/components/Footer.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => (
    <Box mt={5} py={3} bgcolor="grey.200" textAlign="center" sx={{ position: 'relative', bottom: 0, width: '100%' }}>
        <Typography variant="body2">© 2024 Airplane Booking Service</Typography>
    </Box>
);

export default Footer;