import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Flights = () => {
  const [filters, setFilters] = useState({ date: '', airline: '', destination: '' });
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1");

  // Fetch flights on page load, clear localStorage, and store fresh data
  useEffect(() => {
    // Clear any old flight data stored in localStorage on page reload
    localStorage.removeItem('flightsData');

    axios.get(`/flights`)
      .then(res => {
        const flights = res.data;
        localStorage.setItem('flightsData', JSON.stringify(flights));  // Store fresh data
        setFilteredFlights(flights);
      })
      .finally(() => setLoading(false));
  }, []);

  // Apply filters locally to data stored in local storage
  const applyFilters = () => {
    const flights = JSON.parse(localStorage.getItem('flightsData')) || [];
    const filtered = flights.filter(flight => {
      return (!filters.date || flight.date === filters.date) &&
             (!filters.airline || flight.airline.includes(filters.airline)) &&
             (!filters.destination || flight.destination.includes(filters.destination));
    });
    setFilteredFlights(filtered);
  };

  const handleExpandFlight = (flight) => {
    setExpandedFlight(flight);
    setTickets(1); // Reset ticket count when opening a new flight dialog
  };

  const handleTicketChange = (amount) => {
    setTickets(prev => Math.min(Math.max(prev + amount, 1), expandedFlight.available_seats));
  };

  const handleBookFlight = () => {
    if (expandedFlight) {
      let bookingData = {flight_id: expandedFlight.fid,username: username,tickets : tickets};
      
      
      
      
      
      // TODO: for the love of whatever i cherrish plz fix this endpoint issue
      console.log("Booking Data", bookingData);  // Log booking data for debugging
      bookingData = JSON.stringify(bookingData)
      // Send the booking request with the JSON data
      axios.post('/flights/book', bookingData,{headers: {'Content-Type':'application/json'}})
        .then(() => {
          setConfirmDialogOpen(false);
          alert('Booking successful!');
        })
        .catch(err => {
          console.error('Booking failed:', err);
          alert('Booking failed, please try again later.');
        });
    }
  };

  const handleCancelBooking = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Container sx={{ minHeight: '75vh', padding: 3 }}>
      <Typography variant="h4">Available Flights</Typography>
      <Box display="flex" my={2}>
        <TextField
          label="Date"
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          sx={{ marginRight: 2, width:200 }}
          InputLabelProps={{
            shrink:true,
          }}
        />
        <TextField
          label="Airline"
          value={filters.airline}
          onChange={(e) => setFilters({ ...filters, airline: e.target.value })}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Destination"
          value={filters.destination}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
      </Box>

      {loading ? <CircularProgress /> : (
        filteredFlights.map(flight => (
          <Card key={flight.fid} sx={{ marginY: 2 }}>
            <CardContent
              onClick={() => handleExpandFlight(flight)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="h6">{flight.destination}</Typography>
              <Typography variant="body2">${flight.price}</Typography>
            </CardContent>
          </Card>
        ))
      )}

      {/* Flight Details and Booking Dialog */}
      <Dialog open={!!expandedFlight} onClose={() => setExpandedFlight(null)}>
        <DialogTitle>Flight Details</DialogTitle>
        {expandedFlight && (
          <DialogContent>
            <Typography variant="body2">Destination: {expandedFlight.destination}</Typography>
            <Typography variant="body2">Terminal: {expandedFlight.terminal}</Typography>
            <Typography variant="body2">Airline: {expandedFlight.airline}</Typography>
            <Typography variant="body2">Available Seats: {expandedFlight.available_seats}</Typography>
            <Typography variant="body2">Price per Ticket: ${expandedFlight.price}</Typography>
            <Typography variant="body2">Flight ID: {expandedFlight.fid}</Typography> {/* Display fid */}
            <Box display="flex" alignItems="center" my={2}>
              <IconButton onClick={() => handleTicketChange(-1)}>
                <RemoveIcon />
              </IconButton>
              <TextField
                value={tickets}
                onChange={(e) => setTickets(Math.max(1, Math.min(+e.target.value, expandedFlight.available_seats)))}
                type="number"
                sx={{ height:50,width: 80,textAlign:'center', fontSize:'1.5rem',mx: 2 }}
                inputProps={{ min: 1, max: expandedFlight.available_seats }}
              />
              <IconButton onClick={() => handleTicketChange(1)}>
                <AddIcon />
              </IconButton>
              <Typography sx={{ ml: 2 }}>Total: ${expandedFlight.price * tickets}</Typography>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setExpandedFlight(null)}>Close</Button>
          <Button variant="contained" color="primary" onClick={() => setConfirmDialogOpen(true)}>
            Order Tickets
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Booking Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to book {tickets} ticket(s) for {expandedFlight?.destination}?</Typography>
          <Typography>Total: ${expandedFlight ? expandedFlight.price * tickets : 0}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelBooking}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={handleBookFlight}>Yes, Book</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flights;
