// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [editInfo, setEditInfo] = useState({ fullname: '', email: '', password: '', phone: '' });
  const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  useEffect(() => {
    axios.post('/user/me', { username }).then(res => setUserInfo(res.data));
    axios.get(`/tickets?username=${username}`).then(res => setTickets(res.data));
  }, [username]);

  const handleEditProfile = () => {
    axios.post('/user/me/edit', editInfo)
      .then(res => { if (res.status === 200) setOpen(false); });
  };

  return (
    <Container>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="body1">Name: {userInfo.fullname}</Typography>
      <Typography variant="body1">Email: {userInfo.email}</Typography>
      <Typography variant="body1">Phone: {userInfo.phone}</Typography>

      <Button variant="outlined" onClick={() => setOpen(true)}>Update Profile</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField label="Full Name" fullWidth value={editInfo.fullname} onChange={(e) => setEditInfo({ ...editInfo, fullname: e.target.value })} />
          <TextField label="Email" fullWidth value={editInfo.email} onChange={(e) => setEditInfo({ ...editInfo, email: e.target.value })} />
          <TextField label="Password" type="password" fullWidth value={editInfo.password} onChange={(e) => setEditInfo({ ...editInfo, password: e.target.value })} />
          <TextField label="Phone Number" fullWidth value={editInfo.phone} onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditProfile}>Save</Button>
        </DialogActions>
      </Dialog>

      <Box my={3}>
        <Typography variant="h5">Ticket History</Typography>
        {tickets.length > 0 ? (
          tickets.map(ticket => <Typography key={ticket.id}>Flight: {ticket.flightId}, Seats: {ticket.seats}</Typography>)
        ) : (
          <Typography>No tickets bought</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
