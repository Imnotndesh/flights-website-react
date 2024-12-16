import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, CircularProgress, InputAdornment, Dialog, DialogActions, DialogTitle } from '@mui/material';
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
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent default form submission

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
        try {
            const response = await axios.post('/user/register', {
                ...formData,
                role: 'user'  // Indicate this is a regular user
            });

            if (response.status === 201) {
                // Store username and role in cookies
                document.cookie = `username=${formData.username}; path=/; max-age=86400`; // Expires in 1 day
                document.cookie = `role=user; path=/; max-age=86400`; // Store role as 'user'

                setLoading(false);
                setOpenDialog(true); // Show the success dialog
                setTimeout(() => {
                    window.location.href = '/flights'; // Redirect to flights page after dialog
                }, 2000); // Delay the redirect for 2 seconds
            }
        } catch (error) {
            setLoading(false);
            console.error("Registration error:", error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, backgroundColor: 'white', borderRadius: 4, p: 4, boxShadow: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleRegister}>
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
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={usernameAvailable === false || !formData.password || formData.password !== formData.confirmPassword}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                            'Register'
                        )}
                    </Button>
                </Box>
            </form>

            {/* Success Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Registration;
