import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  TextField,
  Box,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';

const Profile = () => {
  const [userData, setUserData] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordBlankError, setPasswordBlankError] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1");

  useEffect(() => {
    axios.post('/user/me', { username }).then((response) => {
      setUserData(response.data);
    });
  }, [username]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Check if tickets already exist in the cookie
      const storedTickets = Cookies.get('tickets');
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets)); // If tickets are already in the cookie, use them
        setDialogOpen(true); // Open the dialog to show the stored tickets
      } else {
        // If tickets are not in the cookie, fetch new tickets from the server
        const response = await axios.get(`/user/tickets?Username=${username}`);
        setTickets(response.data);
        // Store the fetched tickets in a cookie (without expiration to make it session-based)
        Cookies.set('tickets', JSON.stringify(response.data)); // Session cookie (no expiration)
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTickets([]); // Clear tickets when closing the dialog
  };

  const handleProfileUpdate = async () => {
    // Check if password is empty
    if (!userData.password) {
      setPasswordBlankError("Password cannot be blank.");
      return;
    }

    // Reset any previous error messages
    setPasswordBlankError(null);

    // Check if password and confirm password match
    if (userData.password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // Reset password error if no issues
    setPasswordError(null);

    try {
      await axios.put('/user/me/edit', userData);
      setEditDialogOpen(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 3 }}>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="body1">Full Name: {userData.full_name}</Typography>
      <Typography variant="body1">Username: {userData.username}</Typography>
      <Typography variant="body1">Email: {userData.email}</Typography>
      <Typography variant="body1">Phone: {userData.phone}</Typography>

      {/* Update Profile Button */}
      <Box my={2}>
        <Button variant="contained" onClick={() => setEditDialogOpen(true)}>Update Profile</Button>
      </Box>

      {/* View Tickets Button */}
      <Box my={2}>
        {loading ? <CircularProgress /> : (
          <Button variant="contained" onClick={fetchTickets}>View Tickets</Button>
        )}
      </Box>

      {/* Dialog for Updating Profile */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={userData.full_name}
            onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            margin="normal"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
          {passwordBlankError && <Alert severity="error">{passwordBlankError}</Alert>}
          <TextField
            label="Confirm Password"
            type="password"
            required
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && <Alert severity="error">{passwordError}</Alert>}
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />
          <Box my={2}>
            <Button variant="contained" onClick={handleProfileUpdate}>Save Changes</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog for Displaying Tickets */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Your Tickets
          {/* Close button for the dialog */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {tickets.length === 0 ? (
            <Typography>No tickets bought yet.</Typography>
          ) : (
            tickets.map((ticket, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Flight ID: {ticket.tid}</Typography>
                  <Typography>Flight REG: {ticket.reg_no}</Typography>
                  <Typography>Depature Time: {ticket.departure_time}</Typography>
                  <Typography>Destination: {ticket.destination}</Typography>
                  <Typography>Airline: {ticket.airline}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Profile;
