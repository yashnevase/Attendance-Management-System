import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Chip
} from '@mui/material';
import { AccessTime, CheckCircle, Schedule } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from "../../context/api"

const Attendance = () => {
    
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [reportRecords, setReportRecords] = useState([]);
    const [reportStartDate, setReportStartDate] = useState(null);
    const [reportEndDate, setReportEndDate] = useState(null);

    const [todayRecord, setTodayRecord] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token, user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchDailyAttendance();
            fetchAttendanceReport(); // fetch report on load
        }
    }, [user, token]);

    const fetchAttendanceReport = async (start = null, end = null) => {
        try {
            let startDate = start;
            let endDate = end;

            if (!startDate || !endDate) {
                const today = new Date();
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(today.getDate() - 30);

                startDate = thirtyDaysAgo.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
            }

            const url = `/attendance/report?startDate=${startDate}&endDate=${endDate}`;

            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setReportRecords(response.data.attendance || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch attendance report');
        }
    };



    useEffect(() => {
        if (user) {
            fetchDailyAttendance();
        }
    }, [user, token]);

    const fetchDailyAttendance = async (date = null) => {
        try {
            const response = await api.get(
                `/attendance/daily${date ? `?date=${date}` : ''}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const records = response.data.attendance || [];
            setAttendanceRecords(records);

            // Find today's record
            const today = new Date().toDateString();
            const todayRec = records.find(record =>
                new Date(record.check_in).toDateString() === today
            );
            setTodayRecord(todayRec);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch attendance records');
        }
    };

    const handleCheckIn = async () => {
        setMessage('');
        setError('');
        try {
            const response = await api.post(
                '/attendance/check-in',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(response.data.message);
            fetchDailyAttendance();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to check in');
        }
    };

    const handleCheckOut = async () => {
        setMessage('');
        setError('');
        try {
            const response = await api.post(
                '/attendance/check-out',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(response.data.message);
            fetchDailyAttendance();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to check out');
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Attendance Report', 14, 15);

        const tableData = reportRecords.map((record) => [
            new Date(record.check_in).toLocaleDateString(),
            new Date(record.check_in).toLocaleTimeString(),
            record.check_out ? new Date(record.check_out).toLocaleTimeString() : '—',
            record.total_hours,
        ]);

        doc.autoTable({
            head: [['Date', 'Check In', 'Check Out', 'Total Hours']],
            body: tableData,
            startY: 20,
        });

        doc.save('attendance_report.pdf');
    };


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Attendance Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Mark your daily attendance and view your records
            </Typography>

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {/* Today's Attendance Card */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Today's Attendance
                            </Typography>

                            {todayRecord ? (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CheckCircle color="success" sx={{ mr: 1 }} />
                                        <Typography variant="body1">
                                            Checked In: {new Date(todayRecord.check_in).toLocaleTimeString()}
                                        </Typography>
                                    </Box>

                                    {todayRecord.check_out ? (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Schedule color="info" sx={{ mr: 1 }} />
                                                <Typography variant="body1">
                                                    Checked Out: {new Date(todayRecord.check_out).toLocaleTimeString()}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Hours: {todayRecord.total_hours || 'Calculating...'}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Chip
                                                label="Currently Checked In"
                                                color="success"
                                                sx={{ mb: 2 }}
                                            />
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={handleCheckOut}
                                                    startIcon={<AccessTime />}
                                                >
                                                    Check Out
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        You haven't checked in today
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleCheckIn}
                                        startIcon={<AccessTime />}
                                        size="large"
                                    >
                                        Check In
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                This Month's Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h4" color="primary">
                                            {attendanceRecords.length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Days Present
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ textAlign: 'center', p: 2 }}>
                                        <Typography variant="h4" color="success.main">
                                            {attendanceRecords.filter(r => r.total_hours).length}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Complete Days
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Attendance History */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Recent Attendance Records
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Check In</TableCell>
                                    <TableCell>Check Out</TableCell>
                                    <TableCell>Total Hours</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceRecords.length > 0 ? (
                                    attendanceRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                {new Date(record.check_in).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(record.check_in).toLocaleTimeString()}
                                            </TableCell>
                                            <TableCell>
                                                {record.check_out ?
                                                    new Date(record.check_out).toLocaleTimeString() :
                                                    'Not checked out'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {record.total_hours || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={record.check_out ? 'Complete' : 'In Progress'}
                                                    color={record.check_out ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No attendance records found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            {/* report */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Attendance Report 
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="Start Date"
                                    value={reportStartDate}
                                    onChange={(newValue) => setReportStartDate(newValue)}
                                    format="yyyy-MM-dd"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <DatePicker
                                    label="End Date"
                                    value={reportEndDate}
                                    onChange={(newValue) => setReportEndDate(newValue)}
                                    format="yyyy-MM-dd"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        if (reportStartDate && reportEndDate) {
                                            const start = reportStartDate.toISOString().split('T')[0];
                                            const end = reportEndDate.toISOString().split('T')[0];
                                            fetchAttendanceReport(start, end);
                                        } else {
                                            fetchAttendanceReport();
                                        }
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    Filter
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                {/* <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleDownloadPDF}
                                    sx={{ mt: 1 }}
                                >
                                    Download PDF
                                </Button> */}
                            </Grid>
                        </Grid>
                    </LocalizationProvider>

                    {/* Scrollable Table */}
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Check In</TableCell>
                                        <TableCell>Check Out</TableCell>
                                        <TableCell>Total Hours</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportRecords.length > 0 ? (
                                        reportRecords.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell>{new Date(record.check_in).toLocaleDateString()}</TableCell>
                                                <TableCell>{new Date(record.check_in).toLocaleTimeString()}</TableCell>
                                                <TableCell>{record.check_out ? new Date(record.check_out).toLocaleTimeString() : '—'}</TableCell>
                                                <TableCell>{record.total_hours}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No records found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Attendance;
