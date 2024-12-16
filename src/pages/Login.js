import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CircularProgress, Paper, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const navigate = useNavigate();  // For navigation
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
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, boxShadow: 3, borderRadius: 4 }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom>User Login</Typography>
                <form onSubmit={(e) => e.preventDefault()}>
                    <TextField
                        name="username"
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </form>
                <Button
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/register')}  // Redirect to /register page
                >
                    New user? Register here
                </Button>
            </Paper>

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
