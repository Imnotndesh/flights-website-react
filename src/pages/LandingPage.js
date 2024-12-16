// src/pages/LandingPage.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';

const LandingPage = () => (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 3 }}>
        {/* Welcome Text */}
        <Box my={5} textAlign="center">
            <Typography
                variant="h4"
                sx={{
                    fontSize: '3rem',
                    '&:hover': {
                        cursor: 'pointer',
                    },
                }}
            >
                Welcome to Kori!
            </Typography>
        </Box>

        {/* Sections Grid */}
        <Grid container spacing={6}> {/* Increased spacing between grid items */}
            <Grid item xs={12} sm={4}>
                <Box
                    sx={{
                        padding: 4, // Added padding to each section container
                        borderRadius: 2, // Rounded borders for each section container
                        border: '2px solid transparent',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white', // Ensure background color is white
                        transition: 'all 0.3s ease-in-out',
                        minHeight: 200, // Uniform height for all sections
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Vertically center content
                        '&:hover': {
                            borderColor: 'primary.main', // Blue border on hover
                            transform: 'scale(1.05)', // Slight zoom on hover
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                fontSize: '1.1rem', // Slight increase in font size on hover
                            },
                        }}
                    >
                        Low Prices
                    </Typography>
                    <Typography>Enjoy affordable rates for flights around the world.</Typography>
                </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
                <Box
                    sx={{
                        padding: 4, // Added padding to each section container
                        borderRadius: 2, // Rounded borders for each section container
                        border: '2px solid transparent',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white', // Ensure background color is white
                        transition: 'all 0.3s ease-in-out',
                        minHeight: 200, // Uniform height for all sections
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Vertically center content
                        '&:hover': {
                            borderColor: 'primary.main', // Blue border on hover
                            transform: 'scale(1.05)', // Slight zoom on hover
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                fontSize: '1.1rem', // Slight increase in font size on hover
                            },
                        }}
                    >
                        Reliable Service
                    </Typography>
                    <Typography>Book flights with confidence and ease.</Typography>
                </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
                <Box
                    sx={{
                        padding: 4, // Added padding to each section container
                        borderRadius: 2, // Rounded borders for each section container
                        border: '2px solid transparent',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white', // Ensure background color is white
                        transition: 'all 0.3s ease-in-out',
                        minHeight: 200, // Uniform height for all sections
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Vertically center content
                        '&:hover': {
                            borderColor: 'primary.main', // Blue border on hover
                            transform: 'scale(1.05)', // Slight zoom on hover
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                fontSize: '1.1rem', // Slight increase in font size on hover
                            },
                        }}
                    >
                        24/7 Support
                    </Typography>
                    <Typography>Our support team is here to assist you anytime.</Typography>
                </Box>
            </Grid>
        </Grid>
    </Container>
);

export default LandingPage;
