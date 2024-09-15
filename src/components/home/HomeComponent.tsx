import React from 'react';
import {
    Typography,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const HomeComponent: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Box mt={4} p={2} bgcolor="#f9f9f9" borderRadius={2} boxShadow={1}>
                <Typography variant="h5" gutterBottom>
                    How to Use the App
                </Typography>
                
                <Typography variant="body1" paragraph>
                    The app helps users to track expenses and debts among a group. It's perfect for keeping a summary of all payments and transfers related to a trip taken together.
                </Typography>
                
                <Typography variant="body1" paragraph>
                    Users can create an account and log in. Once logged in, users can add all payments and transfers. The app will automatically calculate if any additional transfers are required to balance accounts.
                </Typography>
            </Box>

            <Box mt={4} p={2} bgcolor="#f9f9f9" borderRadius={2} boxShadow={1}>
                <Typography variant="h5" gutterBottom>
                    Technical details
                </Typography>
                
                <Typography variant="body1" paragraph>
                    It is a React SPA built with Vite, deployed on Cloudflare Pages with a Firebase backend. Both the data and user accounts/login are handled by Firebase.
                </Typography>
                
                <Typography variant="body1" paragraph>
                    But what's more important is that this app was built mostly through Cursor IDE and Open AI ChatGPT o1-mini and o1-preview.
                </Typography>
                <Typography variant="body1" paragraph>
                    You can check the code here: <a href="https://github.com/tokrug/settlements">https://github.com/tokrug/settlements</a>
                </Typography>
            </Box>

            <Box mt={4} p={2} bgcolor="#f9f9f9" borderRadius={2} boxShadow={1}>
                <Typography variant="h5" gutterBottom>
                    Tutorial
                </Typography>
                
                <Typography variant="body1" paragraph>
                    Click the login button in the top right corner. Provide username and password and click Sign Up. Email confirmation is not required.
                </Typography>
                
                <Typography variant="body1" paragraph>
                    On the Settlement listing view there is a button to create a test settlement with example data so you don't have to do everything manually from scratch.
                </Typography>
                <Typography variant="body1" paragraph>
                    Settlements can be made public by clicking on the 'Enable Share Link' button. Once this is done the URL of the settlement details view can be shared with anonymous users. Without public access only the person who created the settlement can edit it.
                </Typography>
            </Box>
        </>
    );
};

export default HomeComponent;
