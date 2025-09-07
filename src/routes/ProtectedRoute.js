import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                }}
            >
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role_id)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
