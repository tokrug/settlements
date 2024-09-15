import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { Container } from '@mui/material';
import { useUser } from '../context/UserContext';

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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Settlements App
                    </Typography>
                    {user && (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default NavigationBar;
