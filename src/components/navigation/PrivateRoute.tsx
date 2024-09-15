// src/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const PrivateRoute: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();

  // If the user is authenticated, render the child routes. Otherwise, redirect to login.
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
