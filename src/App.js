// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import Flights from './pages/Flights';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Contacts from './pages/Contacts';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from "./pages/AdminDashboard";
import EditData from './pages/EditData';

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/flights" element={<Flights />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/editdata" element={<EditData />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
