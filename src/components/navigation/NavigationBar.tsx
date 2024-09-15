import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { Box, Container } from '@mui/material';
import { useUser } from '../../context/UserContext';

const NavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AppBar position="static">
            <Container fixed maxWidth="xl">
                <Toolbar>
                    <Button
                            color="inherit"
                            onClick={() => navigate('/')}
                            sx={{ marginRight: 2 }}
                        >
                        Home
                    </Button>
                    {user && (
                        <Button
                        color="inherit"
                        onClick={() => navigate('/settlements')}
                        sx={{ marginRight: 2 }}
                    >
                        Settlements
                    </Button>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    {user && (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                    {!user && (
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavigationBar;
