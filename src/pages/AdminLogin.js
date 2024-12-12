// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
    const [registerData, setRegisterData] = useState({ username: '', password: '', fname: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:9080/admin/login', formData);
            document.cookie = `username=${data.username}; path=/;`;
            document.cookie = `role=admin; path=/;`;
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:9080/admin/register', registerData);
            document.cookie = `username=${data.username}; path=/;`;
            document.cookie = `role=admin; path=/;`;
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
            setOpenRegisterDialog(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 4,
                    p: 4,
                    boxShadow: 3,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Admin Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="username"
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <Button
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => setOpenRegisterDialog(true)}
                >
                    New admin? Register here
                </Button>
            </Box>

            <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)}>
                <DialogTitle>
                    <IconButton onClick={() => setOpenRegisterDialog(false)} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    Admin Registration
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleRegisterSubmit}>
                        <TextField
                            name="fname"
                            label="Full Name"
                            fullWidth
                            margin="normal"
                            value={registerData.fname}
                            onChange={handleRegisterChange}
                        />
                        <TextField
                            name="username"
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                        />
                        <DialogActions>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default AdminLogin;
