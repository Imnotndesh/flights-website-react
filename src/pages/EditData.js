import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    IconButton,
    Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditData = () => {
    const [planes, setPlanes] = useState([]);
    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);
    const username = Cookies.get('username');

    // Fetch data from cookies
    useEffect(() => {
        setPlanes(JSON.parse(Cookies.get('planes') || '[]'));
        setUsers(JSON.parse(Cookies.get('users') || '[]'));
        setFlights(JSON.parse(Cookies.get('flights') || '[]'));
    }, []);

    // Generic delete handler
    const handleDelete = async (id, endpoint) => {
        try {
            await axios.delete(`/admins/delete/${endpoint}`, {
                data: { username, id },
            });
            // Remove the deleted entry from state
            if (endpoint === 'planes') setPlanes(planes.filter((plane) => plane.pid !== id));
            if (endpoint === 'users') setUsers(users.filter((user) => user.uid !== id));
            if (endpoint === 'flights') setFlights(flights.filter((flight) => flight.fid !== id));
            alert(`Successfully deleted ${endpoint} with ID: ${id}`);
        } catch (error) {
            console.error(`Error deleting ${endpoint}:`, error);
        }
    };

    // Generic add handler
    const handleAdd = (endpoint, newData) => {
        axios
            .post(`/admins/edit/${endpoint}`, { username, ...newData })
            .then((response) => {
                const updatedData = response.data;
                if (endpoint === 'planes') setPlanes([...planes, updatedData]);
                if (endpoint === 'users') setUsers([...users, updatedData]);
                if (endpoint === 'flights') setFlights([...flights, updatedData]);
            })
            .catch((error) => console.error(`Error adding ${endpoint}:`, error));
    };

    const renderSection = (title, data, endpoint, keyField) => (
        <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {title}
            </Typography>
            {data.map((item) => (
                <Box
                    key={item[keyField]}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                    }}
                >
                    <TextField
                        fullWidth
                        defaultValue={JSON.stringify(item)}
                        sx={{ mr: 2 }}
                        disabled
                    />
                    <IconButton
                        color="error"
                        onClick={() => handleDelete(item[keyField], endpoint)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => handleAdd(endpoint, { id: new Date().getTime(), newField: '' })}
            >
                Add Entry
            </Button>
        </Box>
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Edit Data
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    {renderSection('Edit/Add Planes', planes, 'planes', 'pid')}
                </Grid>
                <Grid item xs={4}>
                    {renderSection('Edit/Add Users', users, 'users', 'uid')}
                </Grid>
                <Grid item xs={4}>
                    {renderSection('Edit/Add Flights', flights, 'flights', 'fid')}
                </Grid>
            </Grid>
        </Container>
    );
};

export default EditData;
