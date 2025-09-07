import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button
} from '@mui/material';
import {
    People,
    Assignment,
    AccessTime,
    TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import api from "../../context/api"

const AdminDashboard = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingLeaves: 0,
        totalAttendance: 0,
        activeEmployees: 0
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    const fetchDashboardData = async () => {
        try {
            // Fetch recent leave requests
            const leaveResponse = await api.get('/leave/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const leaves = leaveResponse.data.leaveRequests || [];
            setRecentLeaves(leaves.slice(0, 5)); // Show only recent 5
            
            // Calculate stats
            setStats({
                totalUsers: 25, // This would come from your API
                pendingLeaves: leaves.filter(leave => leave.status === 'pending').length,
                totalAttendance: 85, // This would come from your API
                activeEmployees: 20 // This would come from your API
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const StatCard = ({ title, value, icon, color = 'primary' }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="textSecondary" gutterBottom variant="overline">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div">
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ color: `${color}.main` }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Welcome back, {user?.name || user?.username}! Here's what's happening today.
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<People sx={{ fontSize: 40 }} />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Leaves"
                        value={stats.pendingLeaves}
                        icon={<Assignment sx={{ fontSize: 40 }} />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Attendance Rate"
                        value={`${stats.totalAttendance}%`}
                        icon={<AccessTime sx={{ fontSize: 40 }} />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Employees"
                        value={stats.activeEmployees}
                        icon={<TrendingUp sx={{ fontSize: 40 }} />}
                        color="info"
                    />
                </Grid>
            </Grid>

            {/* Recent Leave Requests */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Recent Leave Requests
                        </Typography>
                        {/* <Button variant="outlined" size="small">
                            View All
                        </Button> */}
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee</TableCell>
                                    <TableCell>Leave Type</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    {/* <TableCell>Action</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentLeaves.length > 0 ? (
                                    recentLeaves.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{leave?.name || leave?.username || 'N/A'}</TableCell>
                                            <TableCell>{leave?.leave_type || 'N/A'}</TableCell>
                                            <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={leave.status}
                                                    color={getStatusColor(leave.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            {/* <TableCell>
                                                {['pending', 'approved', 'rejected'].includes(leave.status) && (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button size="small" variant="contained" color="success">
                                                            Approve
                                                        </Button>
                                                        <Button size="small" variant="outlined" color="error">
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                )}
                                            </TableCell> */}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No recent leave requests
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminDashboard;
