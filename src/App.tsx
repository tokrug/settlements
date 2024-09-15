import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SettlementsList from './components/listing/SettlementsList';
import SettlementDetail from './components/details/SettlementDetail';
import { Container } from '@mui/material';
import AuthComponent from './components/login/AuthComponent';
import NavigationBar from './components/navigation/NavigationBar';
import PrivateRoute from './components/navigation/PrivateRoute';
import HomeComponent from './components/home/HomeComponent';

const App: React.FC = () => {

    return (
        <React.Fragment>
            <NavigationBar />
            <Container fixed maxWidth="xl" sx={{ width: 1 }}>
                <Routes>
                    <Route path="/" element={<HomeComponent />} />
                    <Route path="/login" element={<AuthComponent />} />
                    <Route path="/settlements/:id" element={<SettlementDetail />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/settlements" element={<SettlementsList />} />
                    </Route>
                </Routes>
            </Container>
        </React.Fragment>
    );
};

export default App;
