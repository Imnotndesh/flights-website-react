import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SaveIcon from '@mui/icons-material/Save';
import BookIcon from '@mui/icons-material/Book';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(
      document.cookie.replace(/(?:^|.*;\s*)username\s*=\s*([^;]*).*$|^.*$/, '$1')
  );

  const isAdmin = document.cookie.includes('role=admin'); // Check if the user is an admin

  const handleLogout = () => {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUsername(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
      <AppBar position="static">
        <Toolbar>
          <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontFamily: "'Cedarville Cursive', cursive", fontSize: '2.0rem' }}
          >
            Kori
          </Typography>

          {!isAdmin && (
              <>
                <Tooltip title="Home">
                  <Button
                      color="inherit"
                      component={Link}
                      to="/"
                      startIcon={<BookIcon />}
                      sx={{ borderBottom: isActive('/') ? '2px solid white' : 'none' }}
                  >
                    Home
                  </Button>
                </Tooltip>
                <Tooltip title="Flights">
                  <Button
                      color="inherit"
                      component={Link}
                      to="/flights"
                      startIcon={<BookIcon />}
                      sx={{ borderBottom: isActive('/flights') ? '2px solid white' : 'none' }}
                  >
                    Flights
                  </Button>
                </Tooltip>
                <Tooltip title="Contacts">
                  <Button
                      color="inherit"
                      component={Link}
                      to="/contacts"
                      startIcon={<BookIcon />}
                      sx={{ borderBottom: isActive('/contacts') ? '2px solid white' : 'none' }}
                  >
                    Contacts
                  </Button>
                </Tooltip>
              </>
          )}

          {username ? (
              <>
                {isAdmin && (
                    <>
                      <Tooltip title="Dashboard">
                        <Button
                            color="inherit"
                            component={Link}
                            to="/dashboard"
                            startIcon={<BookIcon />}
                            sx={{ borderBottom: isActive('/dashboard') ? '2px solid white' : 'none' }}
                        >
                          Dashboard
                        </Button>
                      </Tooltip>
                      <Tooltip title="Edit Entries">
                        <Button
                            color="inherit"
                            component={Link}
                            to="/editdata"
                            startIcon={<SaveIcon />}
                            sx={{ borderBottom: isActive('/editdata') ? '2px solid white' : 'none' }}
                        >
                          Edit Entries
                        </Button>
                      </Tooltip>
                    </>
                )}
                <Tooltip title="Profile">
                  <Button
                      color="white"
                      startIcon={<AccountBoxIcon />}
                      disabled // Disable the Profile button
                      sx={{ borderBottom: isActive('/profile') ? '2px solid white' : 'none' }}
                  >
                    {username}
                  </Button>
                </Tooltip>
                <Tooltip title="Logout">
                  <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />}>
                    Logout
                  </Button>
                </Tooltip>
              </>
          ) : (
              <>
                <Tooltip title="Login">
                  <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                      startIcon={<LoginIcon />}
                      sx={{ borderBottom: isActive('/login') ? '2px solid white' : 'none' }}
                  >
                    Login
                  </Button>
                </Tooltip>
                <Tooltip title="Sign Up">
                  <Button
                      color="inherit"
                      component={Link}
                      to="/register"
                      startIcon={<PersonAddIcon />}
                      sx={{ borderBottom: isActive('/register') ? '2px solid white' : 'none' }}
                  >
                    Sign Up
                  </Button>
                </Tooltip>
                <Tooltip title="Admin Login">
                  <Button
                      color="inherit"
                      component={Link}
                      to="/admin"
                      startIcon={<AdminPanelSettingsIcon />}
                      sx={{ borderBottom: isActive('/admin') ? '2px solid white' : 'none' }}
                  >
                    Admin
                  </Button>
                </Tooltip>
              </>
          )}
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
