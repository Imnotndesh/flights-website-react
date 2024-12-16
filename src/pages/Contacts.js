import React, { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, Box, Dialog, DialogActions, DialogContent, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Contacts = () => {
    const [formData, setFormData] = useState({ username: '', message: '' });
    const [openDialog, setOpenDialog] = useState(false);

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Open the dialog on submit
        setOpenDialog(true);

        // Close the dialog after 5 seconds and reset form
        setTimeout(() => {
            setOpenDialog(false);
            setFormData({ username: '', message: '' }); // Clear form fields
        }, 5000);
    };

    return (
        <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
                Contact Us
            </Typography>

            <Grid container spacing={4}>
                {/* First Column: Contact Information */}
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor: 'white',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h6">Contact Information</Typography>
                        <Typography>Email: support@airplanebooking.com</Typography>
                        <Typography>Phone: +1-800-555-BOOK</Typography>
                    </Box>
                </Grid>

                {/* Second Column: Contact Form */}
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor: 'white',
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Tell us something
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {/* Message Field */}
                            <TextField
                                label="Send us something"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                sx={{ marginBottom: 2 }}
                            />
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ width: '100%' }}
                            >
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Grid>
            </Grid>

            {/* Success Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ margin: 'auto', bgcolor: 'green', width: 56, height: 56 }}>
                        <CheckCircleIcon sx={{ color: 'white' }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Thanks for the feedback
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {/* Close button is hidden because we rely on the timeout to close the dialog */}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Contacts;
