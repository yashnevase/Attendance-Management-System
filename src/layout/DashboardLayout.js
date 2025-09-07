import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3 ,mt:3}}>
                <Header />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
