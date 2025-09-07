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
    TextField,
    Alert,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import api from "../../context/api"

const TeamLeaveManagement = () => {
    const [teamLeaves, setTeamLeaves] = useState([]);
    console.log(teamLeaves)
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionType, setActionType] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const { token } = useAuth();

    useEffect(() => {
        fetchTeamLeaves();
    }, [token]);

    const fetchTeamLeaves = async () => {
        try {
            const response = await api.get('/leave/team', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(response.data,'ss')
            setTeamLeaves(response?.data?.leaveRequests || []);
        } catch (err) {
            setError('Failed to fetch team leave requests');
        }
    };

    const handleAction = async () => {
        if (!selectedLeave || !actionType) return;

        try {
            const endpoint = actionType === 'approve' ? 'approved' : 'rejected';
            const response = await api.put(
                `/leave/status/${selectedLeave.id}`,
                { manager_comment: comments, status: endpoint },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
            setOpenDialog(false);
            setSelectedLeave(null);
            setComments('');
            fetchTeamLeaves();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${actionType} leave request`);
        }
    };

    const openActionDialog = (leave, action) => {
        setSelectedLeave(leave);
        setActionType(action);
        setOpenDialog(true);
        setMessage('');
        setError('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const filteredRequests = teamLeaves.filter(request => {
        if (filter === 'all') return true;
        return request.status === filter;
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Team Leave Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Manage leave requests from your team members
            </Typography>

            {/* Filter Controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
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
            </Grid>

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Team Leave Requests Table */}
            <Card>
                <CardContent>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee</TableCell>
                                    <TableCell>Leave Type</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Days</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((leave) => {
                                        const startDate = new Date(leave.start_date);
                                        const endDate = new Date(leave.end_date);
                                        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                                        return (
                                            <TableRow key={leave.id}>
                                                <TableCell>{leave?.name || leave?.username || 'N/A'}</TableCell>
                                                <TableCell>{leave?.leave_type || 'N/A'}</TableCell>
                                                <TableCell>{startDate.toLocaleDateString()}</TableCell>
                                                <TableCell>{endDate.toLocaleDateString()}</TableCell>
                                                <TableCell>{days}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {leave.reason}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={leave.status}
                                                        color={getStatusColor(leave.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {leave.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    startIcon={<CheckCircle />}
                                                                    onClick={() => openActionDialog(leave, 'approve')}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="error"
                                                                    startIcon={<Cancel />}
                                                                    onClick={() => openActionDialog(leave, 'reject')}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<Visibility />}
                                                            onClick={() => {
                                                                setSelectedLeave(leave);
                                                                setActionType('view');
                                                                setOpenDialog(true);
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No team leave requests found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Action Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionType === 'approve' ? 'Approve Leave Request' :
                        actionType === 'reject' ? 'Reject Leave Request' : 'Leave Request Details'}
                </DialogTitle>
                <DialogContent>
                    {selectedLeave && (() => {
                        const startDate = new Date(selectedLeave.start_date);
                        const endDate = new Date(selectedLeave.end_date);
                        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Employee: {selectedLeave.name || selectedLeave.username}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Leave Type: {selectedLeave.leave_type}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Duration: {days} day{days > 1 ? 's' : ''}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>Reason:</Typography>
                                <Typography variant="body2" sx={{ mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                                    {selectedLeave.reason}
                                </Typography>

                                {(actionType === 'approve' || actionType === 'reject') && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Comments (Optional)"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        sx={{ mt: 2 }}
                                    />
                                )}
                            </Box>
                        );
                    })()}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    {(actionType === 'approve' || actionType === 'reject') && (
                        <Button
                            onClick={handleAction}
                            variant="contained"
                            color={actionType === 'approve' ? 'success' : 'error'}
                        >
                            {actionType === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeamLeaveManagement;
