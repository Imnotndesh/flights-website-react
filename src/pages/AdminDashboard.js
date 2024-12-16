import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, CircularProgress, Paper } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [usersData, setUsersData] = useState(null);
    const [planesData, setPlanesData] = useState(null);
    const [flightsData, setFlightsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adminUsername, setAdminUsername] = useState('');
    const username = Cookies.get('username');
    const navigate = useNavigate();

    // Function to safely store data in cookies
    const safeSetCookie = (key, data, expiresInDays = 7) => {
        try {
            const jsonData = JSON.stringify(data);
            Cookies.set(key, jsonData, { expires: expiresInDays, path: '/' });
        } catch (error) {
            console.error(`Error saving ${key} to cookie:`, error);
        }
    };

    // Function to safely retrieve data from cookies
    const safeGetCookie = (key) => {
        try {
            const cookieData = Cookies.get(key);
            return cookieData ? JSON.parse(cookieData) : null;
        } catch (error) {
            console.error(`Error retrieving ${key} from cookie:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = { username: username };
                // Check if cookies exist and set data from cookies if available
                const usersCookie = safeGetCookie('users');
                const planesCookie = safeGetCookie('planes');
                const flightsCookie = safeGetCookie('flights');

                if (usersCookie) {
                    setUsersData(usersCookie);
                } else {
                    const usersResponse = await axios.post('/admins/view/users', payload);
                    setUsersData(usersResponse.data);
                    safeSetCookie('users', usersResponse.data); // Save to cookie
                }

                if (planesCookie) {
                    setPlanesData(planesCookie);
                } else {
                    const planesResponse = await axios.post('/admins/view/planes', payload);
                    setPlanesData(planesResponse.data);
                    safeSetCookie('planes', planesResponse.data); // Save to cookie
                }

                if (flightsCookie) {
                    setFlightsData(flightsCookie);
                } else {
                    const flightsResponse = await axios.post('/admins/view/flights', payload);
                    setFlightsData(flightsResponse.data);
                    safeSetCookie('flights', flightsResponse.data); // Save to cookie
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
    }, [username]);

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
                    <Paper onClick={() => navigate('/editdata')} elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Number of Users</Typography>
                        <Typography variant="h5">{usersData ? usersData.length : <CircularProgress size={24} />}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper onClick={() => navigate('/editdata')} elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6">Number of Planes</Typography>
                        <Typography variant="h5">{planesData ? planesData.length : <CircularProgress size={24} />}</Typography>
                    </Paper>
                </Grid>

                {/* Bottom row */}
                <Grid item xs={12} sm={6}>
                    <Paper onClick={() => navigate('/editdata')} elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
