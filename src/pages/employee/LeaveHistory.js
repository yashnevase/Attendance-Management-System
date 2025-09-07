import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Visibility, Add } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../../context/api"

const LeaveHistory = () => {
    const [leaveHistory, setLeaveHistory] = useState([]);
    console.log(leaveHistory)
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filter, setFilter] = useState('all');
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaveHistory();
    }, [token]);

    const fetchLeaveHistory = async () => {
        try {
            const response = await api.get('/leave/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaveHistory(response.data.leaveHistory || []);
        } catch (err) {
            console.error('Failed to fetch leave history:', err);
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

    const filteredHistory = leaveHistory.filter(request => {
        if (filter === 'all') return true;
        return request.status === filter;
    });

    const viewLeaveDetails = (leave) => {
        setSelectedLeave(leave);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Leave History
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                View your leave request history and status
            </Typography>

            {/* Action Bar */}
            <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={filter}
                            label="Filter by Status"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Requests</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* <Grid item>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/employee/apply-leave')}
                    >
                        Apply New Leave
                    </Button>
                </Grid> */}
            </Grid>

            {/* Leave History Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Leave Type</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Days</TableCell>
                                    <TableCell>Applied On</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredHistory.length > 0 ? (
                                    filteredHistory.map((leave) => {
                                        const startDate = new Date(leave.start_date);
                                        const endDate = new Date(leave.end_date);
                                        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                                        
                                        return (
                                            <TableRow key={leave.id}>
                                                <TableCell>{leave.leave_type || 'N/A'}</TableCell>
                                                <TableCell>{startDate.toLocaleDateString()}</TableCell>
                                                <TableCell>{endDate.toLocaleDateString()}</TableCell>
                                                <TableCell>{days}</TableCell>
                                                <TableCell>{new Date(leave.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={leave.status}
                                                        color={getStatusColor(leave.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<Visibility />}
                                                        onClick={() => viewLeaveDetails(leave)}
                                                    >
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Box sx={{ py: 4 }}>
                                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                                    No leave requests found
                                                </Typography>
                                                {/* <Button
                                                    variant="contained"
                                                    startIcon={<Add />}
                                                    onClick={() => navigate('/employee/apply-leave')}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Apply for Leave
                                                </Button> */}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Leave Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Leave Request Details</DialogTitle>
                <DialogContent>
                    {selectedLeave && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Leave Type</Typography>
                                    <Typography variant="body1">{selectedLeave?.leave_type || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                    <Chip
                                        label={selectedLeave.status}
                                        color={getStatusColor(selectedLeave.status)}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                    <Typography variant="body1">{new Date(selectedLeave.start_date).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                    <Typography variant="body1">{new Date(selectedLeave.end_date).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                                    <Typography variant="body1">
                                        {Math.ceil((new Date(selectedLeave.end_date) - new Date(selectedLeave.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Applied On</Typography>
                                    <Typography variant="body1">{new Date(selectedLeave.created_at).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
                                    <Paper sx={{ p: 2, backgroundColor: 'grey.50', mt: 1 }}>
                                        <Typography variant="body2">{selectedLeave.reason}</Typography>
                                    </Paper>
                                </Grid>
                                {selectedLeave.comments && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary">Manager Comments</Typography>
                                        <Paper sx={{ p: 2, backgroundColor: 'grey.50', mt: 1 }}>
                                            <Typography variant="body2">{selectedLeave.comments}</Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LeaveHistory;
