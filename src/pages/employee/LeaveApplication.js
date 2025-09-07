import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Alert,
    Paper
} from '@mui/material';
import { Send, CalendarToday } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from "../../context/api"

const LeaveApplication = () => {
    const [leaveTypeId, setLeaveTypeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [leaveTypes, setLeaveTypes] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaveTypes();
    }, [token]);

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get('/leave/types', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaveTypes(response.data.leaveTypes || []);
            if (response.data.leaveTypes?.length > 0) {
                setLeaveTypeId(response.data.leaveTypes[0].id);
            }
        } catch (err) {
            setError('Failed to fetch leave types');
        }
    };

    const calculateDays = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            return days > 0 ? days : 0;
        }
        return 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validation
        if (new Date(startDate) > new Date(endDate)) {
            setError('End date must be after start date');
            return;
        }

        try {
            const response = await api.post(
                '/leave/submit',
                { 
                    leave_type_id: parseInt(leaveTypeId), 
                    start_date: startDate, 
                    end_date: endDate, 
                    reason 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessage(response.data.message);
            setStartDate('');
            setEndDate('');
            setReason('');
            
            // Redirect to leave history after 1 seconds
            setTimeout(() => {
                navigate('/employee/leave-history');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit leave request');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Apply for Leave
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Submit your leave request for approval
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Leave Request Form
                            </Typography>
                            
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Leave Type</InputLabel>
                                            <Select
                                                value={leaveTypeId}
                                                label="Leave Type"
                                                onChange={(e) => setLeaveTypeId(e.target.value)}
                                            >
                                                {leaveTypes.map(type => (
                                                    <MenuItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Start Date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="End Date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Reason for Leave"
                                            multiline
                                            rows={4}
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Please provide a detailed reason for your leave request..."
                                            required
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            startIcon={<Send />}
                                            sx={{ mt: 2 }}
                                        >
                                            Submit Leave Request
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            
                            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Leave Summary
                            </Typography>
                            
                            {startDate && endDate && (
                                <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
                                        <Typography variant="subtitle2">
                                            Duration: {calculateDays()} day(s)
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        From: {new Date(startDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        To: {new Date(endDate).toLocaleDateString()}
                                    </Typography>
                                </Paper>
                            )}
                            
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" sx={{mb:2}}>
                                    Leave Policy Reminders:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    • Emergency leaves require manager approval
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    • Annual leave balance: Check your dashboard
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    • Sick leaves may require medical certificate
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LeaveApplication;
