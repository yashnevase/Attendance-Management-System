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
    Button,
    LinearProgress
} from '@mui/material';
import {
    Assignment,
    AccessTime,
    CheckCircle,
    Pending,
    Add
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../../context/api"

const EmployeeDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        leaveBalance: 20
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    const fetchDashboardData = async () => {
        try {
            // Fetch leave history
            const leaveResponse = await api.get('/leave/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const leaves = leaveResponse.data.leaveHistory || [];
            setRecentLeaves(leaves.slice(0, 5)); // Show only recent 5
            
            // Calculate stats
            setStats({
                totalLeaves: leaves.length,
                pendingLeaves: leaves.filter(leave => leave.status === 'pending').length,
                approvedLeaves: leaves.filter(leave => leave.status === 'approved').length,
                leaveBalance: 20 - leaves.filter(leave => leave.status === 'approved').length
            });

            // Fetch today's attendance
            const attendanceResponse = await api.get('/attendance/daily', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const todayRecord = attendanceResponse.data.attendance?.[0];
            setTodayAttendance(todayRecord);
            
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

    const StatCard = ({ title, value, icon, color = 'primary', onClick }) => (
        <Card sx={{ height: '100%', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
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
                Employee Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Welcome back, {user?.name || user?.username}! Here's your overview.
            </Typography>

            {/* Quick Actions */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/employee/apply-leave')}
                    >
                        Apply for Leave
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        startIcon={<AccessTime />}
                        onClick={() => navigate('/attendance')}
                    >
                        Mark Attendance
                    </Button>
                </Grid>
            </Grid>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Leave Balance"
                        value={stats.leaveBalance}
                        icon={<Assignment sx={{ fontSize: 40 }} />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Leaves"
                        value={stats.pendingLeaves}
                        icon={<Pending sx={{ fontSize: 40 }} />}
                        color="warning"
                        onClick={() => navigate('/employee/leave-history')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Approved Leaves"
                        value={stats.approvedLeaves}
                        icon={<CheckCircle sx={{ fontSize: 40 }} />}
                        color="success"
                        onClick={() => navigate('/employee/leave-history')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Leaves"
                        value={stats.totalLeaves}
                        icon={<Assignment sx={{ fontSize: 40 }} />}
                        color="info"
                        onClick={() => navigate('/employee/leave-history')}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Today's Attendance */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Today's Attendance
                            </Typography>
                            {todayAttendance ? (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Check In: {new Date(todayAttendance.check_in).toLocaleTimeString()}
                                    </Typography>
                                    {todayAttendance.check_out ? (
                                        <>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Check Out: {new Date(todayAttendance.check_out).toLocaleTimeString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Hours: {todayAttendance.total_hours || 'Calculating...'}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body2" color="warning.main">
                                            Still checked in
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        No attendance record for today
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => navigate('/attendance')}
                                    >
                                        Mark Attendance
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Leave Balance Progress */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Leave Balance
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Used: {20 - stats.leaveBalance}</Typography>
                                    <Typography variant="body2">Remaining: {stats.leaveBalance}</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={((20 - stats.leaveBalance) / 20) * 100}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    Total Annual Leave: 20 days
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Leave Requests */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Recent Leave Requests
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate('/employee/leave-history')}
                        >
                            View All
                        </Button>
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Leave Type</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Days</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentLeaves.length > 0 ? (
                                    recentLeaves.map((leave) => {
                                        const startDate = new Date(leave.start_date);
                                        const endDate = new Date(leave.end_date);
                                        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                                        
                                        return (
                                            <TableRow key={leave.id}>
                                                <TableCell>{leave?.leave_type || 'N/A'}</TableCell>
                                                <TableCell>{startDate.toLocaleDateString()}</TableCell>
                                                <TableCell>{endDate.toLocaleDateString()}</TableCell>
                                                <TableCell>{days}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={leave.status}
                                                        color={getStatusColor(leave.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No leave requests found
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

export default EmployeeDashboard;
