import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  CircularProgress,
  Grid,
  Avatar,
  IconButton,
  Alert,
  Tooltip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

const Profile = () => {
  const [userData, setUserData] = useState({ full_name: '', email: '', password: '', phone: '', username: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordBlankError, setPasswordBlankError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [topUpStatus, setTopUpStatus] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  const username = document.cookie.replace(/(?:^|.*;\s*)username\s*=\s*([^;]*).*$|^.*$/, "$1");

  useEffect(() => {
    axios.post('/user/me', { username }).then((response) => {
      setUserData(response.data);
    });
  }, [username]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/user/tickets?username=${username}`);
      setTickets(response.data);
      setTicketDialogOpen(true);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userData.password) {
      setPasswordBlankError('Password cannot be blank.');
      return;
    }
    setPasswordBlankError(null);

    if (userData.password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordError(null);

    try {
      await axios.put('/user/me/edit', userData);
      setEditDialogOpen(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleTopUp = async () => {
    try {
      const response = await axios.post('/user/me/top-up', { username, amount: topUpAmount });
      if (response.status === 200) {
        setTopUpStatus('success');
      } else {
        setTopUpStatus('failed');
      }
      setTopUpDialogOpen(false);
      setTimeout(() => setTopUpStatus(null), 2000); // Clear status after 2 seconds
    } catch (error) {
      setTopUpStatus('failed');
      setTimeout(() => setTopUpStatus(null), 2000);
    }
  };

  return (
      <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 3 }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: 4 }}>
          Profile
        </Typography>
        <Grid container spacing={4}>
          {/* First Column: Profile Information */}
          <Grid item xs={12} sm={6}>
            <Box
                sx={{
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
            >
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'gray' }} />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                {userData.username}
              </Typography>
              <Typography variant="body1">Full Name: {userData.full_name}</Typography>
              <Typography variant="body1">Email: {userData.email}</Typography>
              <Typography variant="body1">Phone: {userData.phone}</Typography>
            </Box>
          </Grid>

          {/* Second Column: Account Actions */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 2, backgroundColor: 'white' }}>
              <Typography variant="h6">Account Actions</Typography>
              {/* Update Profile Button */}
              <Box my={2}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ArrowUpwardIcon />}
                    onClick={() => setEditDialogOpen(true)}
                >
                  Update Profile
                </Button>
              </Box>
              {/* View Tickets Button */}
              <Box my={2}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Button variant="contained" fullWidth startIcon={<ConfirmationNumberIcon />} onClick={fetchTickets}>
                      View Tickets
                    </Button>
                )}
              </Box>
              {/* Top-Up Balance Button */}
              <Box my={2}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AttachMoneyIcon />}
                    onClick={() => setTopUpDialogOpen(true)}
                >
                  Top-Up Balance
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Dialog for Displaying Tickets */}
        <Dialog open={ticketDialogOpen} onClose={() => setTicketDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            Your Tickets
            {/* Close button for the dialog */}
            <Tooltip title="Close" placement="top">
              <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => setTicketDialogOpen(false)}
                  aria-label="close"
                  sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <DialogContent dividers>
            {tickets.length === 0 ? (
                <Typography>No tickets bought yet.</Typography>
            ) : (
                tickets.map((ticket, index) => (
                    <Box key={index} sx={{ marginBottom: 2, padding: 2, borderRadius: 1, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="h6">Flight ID: {ticket.tid}</Typography>
                      <Typography>Flight REG: {ticket.reg_no}</Typography>
                      <Typography>Departure Time: {ticket.departure_time}</Typography>
                      <Typography>Destination: {ticket.destination}</Typography>
                      <Typography>Airline: {ticket.airline}</Typography>
                    </Box>
                ))
            )}
          </DialogContent>
        </Dialog>

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
              <Button variant="contained" onClick={handleProfileUpdate} fullWidth>
                Save Changes
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Dialog for Top-Up */}
        <Dialog open={topUpDialogOpen} onClose={() => setTopUpDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Top-Up Balance</DialogTitle>
          <DialogContent>
            <TextField
                label="Amount"
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                      <>
                        <IconButton onClick={() => setTopUpAmount(topUpAmount - 1)}>-</IconButton>
                        <IconButton onClick={() => setTopUpAmount(topUpAmount + 1)}>+</IconButton>
                      </>
                  ),
                }}
            />
            <Box my={2}>
              <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SendIcon />}
                  onClick={handleTopUp}
              >
                Top-Up Amount to Account
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Top-Up Status Dialog */}
        <Dialog open={topUpStatus !== null} onClose={() => setTopUpStatus(null)} fullWidth maxWidth="xs">
          <DialogTitle>{topUpStatus === 'success' ? 'Success' : 'Failed'}</DialogTitle>
          <DialogContent>
            <Avatar sx={{ bgcolor: topUpStatus === 'success' ? 'green' : 'red', width: 40, height: 40 }}>
              {topUpStatus === 'success' ? (
                  <CheckCircleIcon sx={{ color: 'white' }} />
              ) : (
                  <ErrorIcon sx={{ color: 'white' }} />
              )}
            </Avatar>
            <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
              {topUpStatus === 'success' ? 'Top-up successful!' : 'Top-up failed'}
            </Typography>
          </DialogContent>
        </Dialog>
      </Container>
  );
};

export default Profile;
