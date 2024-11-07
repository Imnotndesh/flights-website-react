// src/pages/Flights.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, MenuItem, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const Flights = () => {
  const [filters, setFilters] = useState({ date: '', airline: '', destination: '' });
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [tickets, setTickets] = useState(1);
  const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  const handleSearch = () => {
    axios.get(`/flights`, { params: filters }).then(res => setFlights(res.data));
  };

  const handleBookFlight = () => {
    axios.post('/flights/book', { flightId: selectedFlight.id, seats: tickets, username })
      .then(() => setSelectedFlight(null));
  };

  return (
    <Container>
      <Typography variant="h4">Search Flights</Typography>
      <Box display="flex" my={2}>
        <TextField label="Date" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        <TextField label="Airline" value={filters.airline} onChange={(e) => setFilters({ ...filters, airline: e.target.value })} />
        <TextField label="Destination" value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value })} />
        <Button onClick={handleSearch}>Search</Button>
      </Box>

      {flights.map(flight => (
        <Box key={flight.id} onClick={() => setSelectedFlight(flight)} style={{ cursor: 'pointer', padding: 8, border: '1px solid grey', margin: '8px 0' }}>
          <Typography>{flight.airline} - {flight.destination}</Typography>
          <Typography>{flight.date}</Typography>
        </Box>
      ))}

      <Dialog open={!!selectedFlight} onClose={() => setSelectedFlight(null)}>
        <DialogTitle>Book Flight</DialogTitle>
        <DialogContent>
          <Typography>{selectedFlight && selectedFlight.airline} - {selectedFlight && selectedFlight.destination}</Typography>
          <TextField label="Tickets" type="number" value={tickets} onChange={(e) => setTickets(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFlight(null)}>Cancel</Button>
          <Button onClick={handleBookFlight}>Book</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flights;
