import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Container, Typography, TextField, Button, Box, Card, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip,
    Fab, Badge, CircularProgress
} from '@mui/material';
import {
    Add as AddIcon, Remove as RemoveIcon, ShoppingCart as ShoppingCartIcon,
    Delete as DeleteIcon, AttachMoney as CashIcon, Flight as FlightIcon
} from '@mui/icons-material';

const Flights = () => {
    const [filters, setFilters] = useState({ airline: '', destination: '' });
    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [expandedFlight, setExpandedFlight] = useState(null);
    const [tickets, setTickets] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [cartDialogOpen, setCartDialogOpen] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [userBalance, setUserBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authDialogOpen, setAuthDialogOpen] = useState(false);

    const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1");

    const calculateTotal = useCallback(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
        setCartTotal(total);
    }, [cartItems]);

    useEffect(() => {
        // Load flights from cookies or fetch
        const cachedFlights = document.cookie.replace(/(?:(?:^|.*;\s*)flightsData\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const lastUpdated = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)flightsUpdated\s*=\s*([^;]*).*$)|^.*$/, "$1")) || 0;

        if (!cachedFlights || Date.now() - lastUpdated > 2 * 60 * 1000) {
            axios.get('/flights')
                .then(res => {
                    setFlights(res.data);
                    setFilteredFlights(res.data);
                    document.cookie = `flightsData=${JSON.stringify(res.data)}; path=/`;
                    document.cookie = `flightsUpdated=${Date.now()}; path=/`;
                })
                .finally(() => setLoading(false));
        } else {
            const flightsData = JSON.parse(cachedFlights);
            setFlights(flightsData);
            setFilteredFlights(flightsData);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedCart = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)cart\s*=\s*([^;]*).*$)|^.*$/, "$1") || '[]');
        setCartItems(storedCart);
        calculateTotal(storedCart);

        const balance = parseInt(document.cookie.replace(/(?:(?:^|.*;\s*)balance\s*=\s*([^;]*).*$)|^.*$/, "$1"));
        if (!username) {
            setAuthDialogOpen(true);
        } else if (!balance) {
            axios.post('/user/me', { username })
                .then(res => {
                    setUserBalance(res.data.balance);
                    document.cookie = `balance=${res.data.balance}; path=/`;
                })
                .catch(() => {
                    alert('Could not fetch user balance. Please try again.');
                });
        } else {
            setUserBalance(balance);
        }
    }, [username, calculateTotal]);

    const applyFilters = () => {
        const filtered = flights.filter(flight => {
            return (!filters.airline || flight.airline.includes(filters.airline)) &&
                (!filters.destination || flight.destination.includes(filters.destination));
        });
        setFilteredFlights(filtered);
    };

    const handleExpandFlight = (flight) => {
        setExpandedFlight(flight);
        setTickets(1);
    };

    const handleTicketChange = (amount) => {
        setTickets(prev => Math.min(Math.max(prev + amount, 1), expandedFlight.available_seats));
    };

    const handleAddToCart = () => {
        if (expandedFlight) {
            const newBooking = {
                fid: expandedFlight.fid,
                destination: expandedFlight.destination,
                price: expandedFlight.price * tickets,
                tickets
            };
            const updatedCart = [...cartItems, newBooking];
            setCartItems(updatedCart);
            calculateTotal(updatedCart);
            document.cookie = `cart=${JSON.stringify(updatedCart)}; path=/`;
            setExpandedFlight(null);
        }
    };

    const handleRemoveFromCart = (index) => {
        const updatedCart = [...cartItems];
        updatedCart.splice(index, 1);
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
        document.cookie = `cart=${JSON.stringify(updatedCart)}; path=/`;
    };

    const handlePay = () => {
        const bookings = cartItems.map(item => ({
            fid: item.fid,
            username,
            tickets: item.tickets
        }));
        axios.post('/flights/book', bookings)
            .then(() => {
                alert('Payment successful!');
                setCartItems([]);
                calculateTotal([]);
                document.cookie = `cart=[]; path=/`;
            })
            .catch(() => alert('Payment failed. Please try again.'));
    };

    return (
        <Container>
            {/* Filters */}
            <Box display="flex" justifyContent="center" my={2}>
                <TextField
                    label="Airline"
                    value={filters.airline}
                    onChange={(e) => setFilters({ ...filters, airline: e.target.value })}
                    sx={{ mx: 1 }}
                />
                <TextField
                    label="Destination"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    sx={{ mx: 1 }}
                />
                <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
            </Box>

            {/* Flight Cards */}
            {loading ? (
                <CircularProgress />
            ) : (
                filteredFlights.map(flight => (
                    <Tooltip title="Click to learn more or book a flight" key={flight.fid}>
                        <Card sx={{ my: 2, cursor: 'pointer', borderRadius: 2, display:'flex' }} onClick={() => handleExpandFlight(flight)}>
                            <CardContent display="flex" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Typography variant="h6" sx={{ flex:1 }}>
                                        {flight.origin} <FlightIcon /> {flight.destination}
                                    </Typography>
                                </Box>
                                <Typography variant="h7" sx={{textAlign:'right'}}>KSH. {flight.price}</Typography>
                            </CardContent>
                        </Card>
                    </Tooltip>
                ))
            )}

            {/* Booking Dialog */}
            <Dialog open={!!expandedFlight} onClose={() => setExpandedFlight(null)} maxWidth="md" fullWidth>
                <DialogTitle>Flight Details</DialogTitle>
                {expandedFlight && (
                    <DialogContent>
                        <Typography>From: {expandedFlight.from}</Typography>
                        <Typography>Destination: {expandedFlight.destination}</Typography>
                        <Typography>Airline: {expandedFlight.airline}</Typography>
                        <Typography>Price: ${expandedFlight.price}</Typography>
                        <Typography>Available Seats: {expandedFlight.available_seats}</Typography>
                        <Box display="flex" alignItems="center" mt={2}>
                            <IconButton onClick={() => handleTicketChange(-1)}><RemoveIcon /></IconButton>
                            <TextField value={tickets} type="number" inputProps={{ min: 1 }} sx={{ mx: 1, width: '10vw', fontsize: '1.2rem' }} />
                            <IconButton onClick={() => handleTicketChange(1)}><AddIcon /></IconButton>
                        </Box>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={() => setExpandedFlight(null)}>Close</Button>
                    <Button onClick={handleAddToCart} variant="contained" color="primary">Add to Cart</Button>
                </DialogActions>
            </Dialog>

            {/* Cart Dialog */}
            <Badge badgeContent={cartItems.length} color="secondary" sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                <Fab color="primary" aria-label="add" sx={{position: 'fixed', bottom:'16px', right:'16px', zIndex:1000}} onClick={() => setCartDialogOpen(true)}>
                    <ShoppingCartIcon />
                </Fab>
            </Badge>
            <Dialog open={cartDialogOpen} onClose={() => setCartDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Your Cart</DialogTitle>
                <DialogContent>
                    {cartItems.length === 0 ? (
                        <Typography>No items in the cart.</Typography>
                    ) : (
                        cartItems.map((item, index) => (
                            <Box
                                key={index}
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                my={2}
                                sx={{ padding: '10px', borderBottom: '1px solid #ccc' }}
                            >
                                <Typography variant="body1"><strong>Destination:</strong> {item.destination}</Typography>
                                <Typography variant="body1"><strong>Tickets:</strong> {item.tickets}</Typography>
                                <Typography variant="body1"><strong>Price:</strong> ${item.price}</Typography>
                                <IconButton onClick={() => handleRemoveFromCart(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))
                    )}
                </DialogContent>
                <DialogActions>
                    <Typography
                        variant="h6"
                        color={cartTotal > userBalance ? 'error' : 'textPrimary'}
                        sx={{ flexGrow: 1, fontSize: '1.0rem' }}
                    >
                        Tickets Total: ${cartTotal} {userBalance !== null && ` | Current User Balance: $${userBalance}`}
                    </Typography>
                    <Button
                        startIcon={<CashIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handlePay}
                        disabled={cartItems.length === 0 || cartTotal > userBalance}
                    >
                        Pay
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Authentication Dialog */}
            <Dialog open={authDialogOpen}>
                <DialogTitle>Authentication Required</DialogTitle>
                <DialogContent>
                    <Typography>
                        Please sign in or register to continue.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => (window.location.href = '/login')}
                        variant="contained"
                        color="primary"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => (window.location.href = '/register')}
                        variant="contained"
                        color="secondary"
                    >
                        Register
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Flights;
