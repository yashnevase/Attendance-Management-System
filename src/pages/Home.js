import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Paper,
    Container
} from '@mui/material';
import {
    Dashboard,
    People,
    Assignment,
    AccessTime,
    TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

 

    const getQuickActions = () => {
        if (user?.role_id === 1) {
            return [
                { title: 'Manage Users', path: '/admin/users', icon: <People />, color: 'primary' },
                { title: 'Leave Requests', path: '/admin/leave-requests', icon: <Assignment />, color: 'warning' },
                { title: 'Attendance', path: '/attendance', icon: <AccessTime />, color: 'success' }
            ];
        } else if (user?.role_id === 2) {
            return [
                { title: 'Team Leave', path: '/manager/team-leave', icon: <Assignment />, color: 'primary' },
                { title: 'Attendance', path: '/attendance', icon: <AccessTime />, color: 'success' }
            ];
        } else if (user?.role_id === 3) {
            return [
                { title: 'Apply Leave', path: '/employee/apply-leave', icon: <Assignment />, color: 'primary' },
                { title: 'Leave History', path: '/employee/leave-history', icon: <TrendingUp />, color: 'info' },
                { title: 'Attendance', path: '/attendance', icon: <AccessTime />, color: 'success' }
            ];
        }
        return [];
    };
getQuickActions();
    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h3" >
                        Welcome to Smart Leave & Attendance Management
                    </Typography>
                    <Typography variant="h6" color="text.secondary" >
                        Please login to access your dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{ mt: 3 }}
                    >
                        Login
                    </Button>
                </Box>
            </Container>
        );
    }

    


};

export default Home;