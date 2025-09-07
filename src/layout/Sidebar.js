import React from 'react';
import { 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    Toolbar, 
    Divider, 
    Typography,
    Box 
} from '@mui/material';
import {
    Dashboard,
    People,
    Assignment,
    AccessTime,
    History,
    PersonAdd,
    Group,
    Home
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const getNavItems = () => {

        if (user?.role_id === 1) { // Admin
            return [
                { text: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard /> },
                { text: 'User Management', path: '/admin/users', icon: <People /> },
                { text: 'Leave Requests', path: '/admin/leave-requests', icon: <Assignment /> },
            ];
        } else if (user?.role_id === 2) { // Manager
            return [
                { text: 'Dashboard', path: '/manager/dashboard', icon: <Dashboard /> },
                { text: 'Team Leave', path: '/manager/team-leave', icon: <Group /> },
            ];
        } else if (user?.role_id === 3) { // Employee
            return [
                { text: 'Dashboard', path: '/employee/dashboard', icon: <Dashboard /> },
                { text: 'Apply Leave', path: '/employee/apply-leave', icon: <Assignment /> },
                { text: 'Leave History', path: '/employee/leave-history', icon: <History /> },
                { text: 'Attendance', path: '/attendance', icon: <AccessTime /> }
            ];
        }
        return []

    };

    const navItems = getNavItems();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { 
                    width: drawerWidth, 
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5'
                },
            }}
        >
            <Toolbar />
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                    {user?.role_id === 1 ? 'Admin Panel' : 
                     user?.role_id === 2 ? 'Manager Panel' : 
                     user?.role_id === 3 ? 'Employee Panel' : 'Dashboard'}
                </Typography>
                {user && (
                    <Typography variant="body2" color="text.secondary">
                        Welcome, {user.name || user.username}
                    </Typography>
                )}
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem 
                        button 
                        component={Link} 
                        to={item.path} 
                        key={item.text}
                        selected={location.pathname === item.path}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'primary.light',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
