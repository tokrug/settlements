import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettlementsList from './components/listing/SettlementsList';
import SettlementDetail from './components/details/SettlementDetail';
import { Container } from '@mui/material';
import AuthComponent from './components/login/AuthComponent';
import NavigationBar from './components/NavigationBar';

const App: React.FC = () => {

    return (
        <React.Fragment>
            <NavigationBar />
            <Container fixed maxWidth="xl" sx={{ width: 1 }}>
                <Routes>
                    <Route path="/" element={<AuthComponent />} />
                    <Route path="/settlements" element={<SettlementsList />} />
                    <Route path="/settlements/:id" element={<SettlementDetail />} />
                </Routes>
            </Container>
        </React.Fragment>
    );
};

export default App;
