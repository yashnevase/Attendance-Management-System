const express = require('express');
const router = express.Router();
const attendanceService = require('../service/attendance_service');
const { verifyToken, checkRole } = require('../lib/auth');
const dayjs = require('dayjs');

// Employee can mark daily check-in
router.post('/check-in', verifyToken, checkRole(['Employee']), async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const newCheckIn = await attendanceService.checkIn(userId);
        res.status(201).send({ message: 'Checked in successfully', attendance: newCheckIn });
    } catch (error) {
        res.status(500).send({ message: 'Error during check-in', error: error.message });
        console.error(error);
    }
});

// Employee can mark daily check-out
router.post('/check-out', verifyToken, checkRole(['Employee']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedAttendance = await attendanceService.checkOut(userId);
        res.status(200).send({ message: 'Checked out successfully', attendance: updatedAttendance });
    } catch (error) {
        res.status(500).send({ message: 'Error during check-out', error: error.message });
        console.error(error);
    }
});

// Employee can view daily attendance
router.get('/daily', verifyToken, checkRole(['Employee', 'Manager', 'Admin']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { date } = req.query; 
        const attendanceRecords = await attendanceService.getDailyAttendance(userId, date);
        res.status(200).send({ message: 'Daily attendance fetched successfully', attendance: attendanceRecords });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching daily attendance', error: error.message });
        console.error(error);
    }
});


router.get('/report', verifyToken, checkRole(['Employee', 'Manager', 'Admin']), async (req, res, next) => {
    try {
        const userId = req.user.id;
        let { startDate, endDate } = req.query;

        // Trim and validate dates, fallback to null if invalid or empty
        startDate = startDate && startDate.trim() !== '' ? startDate.trim() : null;
        endDate = endDate && endDate.trim() !== '' ? endDate.trim() : null;

        const attendanceRecords = await attendanceService.getAttendanceReport(userId, startDate, endDate);

        res.status(200).send({
            message: 'Attendance report fetched successfully',
            startDate: startDate || 'NA',
            endDate: endDate || 'NA',
            totalRecords: attendanceRecords.length,
            attendance: attendanceRecords,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching attendance report', error: error.message });
    }
});



module.exports = router;
