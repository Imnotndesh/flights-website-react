import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, CircularProgress, Paper } from '@mui/material';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
    const [usersData, setUsersData] = useState(null);
    const [planesData, setPlanesData] = useState(null);
    const [flightsData, setFlightsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adminUsername, setAdminUsername] = useState('');
    const username = Cookies.get('username');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = {username :username };
                // Check if cookies exist and set data from cookies if available
                const usersCookie = Cookies.get('users');
                const planesCookie = Cookies.get('planes');
                const flightsCookie = Cookies.get('flights');

                if (usersCookie) {
                    setUsersData(JSON.parse(usersCookie));
                } else {
                    const usersResponse = await axios.post('/admins/view/users',payload);
                    setUsersData(usersResponse.data);
                    Cookies.set('users', JSON.stringify(usersResponse.data)); // Save to cookie
                }
                if (planesCookie) {
                    setPlanesData(JSON.parse(planesCookie));
                } else {
                    const planesResponse = await axios.post('/admins/view/planes',payload);
                    setPlanesData(planesResponse.data);
                    Cookies.set('planes', JSON.stringify(planesResponse.data)); // Save to cookie
                }

                if (flightsCookie) {
                    setFlightsData(JSON.parse(flightsCookie));
                } else {
                    const flightsResponse = await axios.post('/admins/view/flights',payload);
                    setFlightsData(flightsResponse.data);
                    Cookies.set('flights', JSON.stringify(flightsResponse.data)); // Save to cookie
                }

                // Get admin username from cookies

                if (username) {
                    setAdminUsername(username);
                }

                setLoading(false); // Finished loading data
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 3 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ minHeight: '100vh', padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>Admin Dashboard</Typography>
            <Grid container spacing={4}>
                {/* Top row */}
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Number of Users</Typography>
                        <Typography variant="h5">{usersData ? usersData.length : <CircularProgress size={24} />}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Number of Planes</Typography>
                        <Typography variant="h5">{planesData ? planesData.length : <CircularProgress size={24} />}</Typography>
                    </Paper>
                </Grid>

                {/* Bottom row */}
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Number of Flights</Typography>
                        <Typography variant="h5">{flightsData ? flightsData.length : <CircularProgress size={24} />}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Admin Username</Typography>
                        <Typography variant="h5">{adminUsername || 'Loading...'}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
