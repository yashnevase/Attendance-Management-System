const express = require('express');
const router = express.Router();
const leaveService = require('../service/leave_service');
const { verifyToken, checkRole } = require('../lib/auth');

// Employee can submit leave requests
router.post('/submit', verifyToken, checkRole(['Employee']), async (req, res, next) => {
    try {
        const { leave_type_id, start_date, end_date, reason } = req.body;
        const userId = req.user.id; 
        const newLeaveRequest = await leaveService.submitLeaveRequest(userId, leave_type_id, start_date, end_date, reason);
        res.status(201).send({ message: 'Leave request submitted successfully', leaveRequest: newLeaveRequest });
    } catch (error) {
        res.status(500).send({ message: 'Error submitting leave request', error: error.message });
        console.error(error);
    }
});

// Employee can view their leave balance and history
router.get('/history', verifyToken, checkRole(['Employee', 'Manager', 'Admin']), async (req, res, next) => {
    try {
        const userId = req.user.id; 
        const leaveHistory = await leaveService.getLeaveHistory(userId);
        res.status(200).send({ message: 'Leave history fetched successfully', leaveHistory });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching leave history', error: error.message });
        console.error(error);
    }
});

// Admin and Manager can view all leave requests
router.get('/all', verifyToken, checkRole(['Admin', 'Manager']), async (req, res, next) => {
    try {
        const leaveRequests = await leaveService.getAllLeaveRequests();
        res.status(200).send({ message: 'All leave requests fetched successfully', leaveRequests });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all leave requests', error: error.message });
        console.error(error);
    }
});

// Manager can view all employee leave requests
router.get('/team', verifyToken, checkRole(['Manager']), async (req, res, next) => {
    try {
        const leaveRequests = await leaveService.getEmployeeLeaveRequestsForManager(); 
        res.status(200).send({ message: 'Team leave requests fetched successfully', leaveRequests });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching team leave requests', error: error.message });
        console.error(error);
    }
});

// Get all leave types
router.get('/types', verifyToken, checkRole(['Employee', 'Manager', 'Admin']), async (req, res, next) => {
    try {
        const leaveTypes = await leaveService.getLeaveTypes();
        res.status(200).send({ message: 'Leave types fetched successfully', leaveTypes });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching leave types', error: error.message });
        console.error(error);
    }
});

// Manager can approve/reject leave requests
router.put('/status/:id', verifyToken, checkRole(['Manager']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, manager_comment } = req.body;
        const managerId = req.user.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).send({ message: 'Invalid status provided. Must be \'approved\' or \'rejected\'.' });
        }

        const updatedLeaveRequest = await leaveService.updateLeaveRequestStatus(id, status, manager_comment, managerId);
        res.status(200).send({ message: 'Leave request status updated successfully', leaveRequest: updatedLeaveRequest });
    } catch (error) {
        res.status(500).send({ message: 'Error updating leave request status', error: error.message });
        console.error(error);
    }
});

// Admin can override leave decisions
router.put('/override/:id', verifyToken, checkRole(['Admin']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const adminId = req.user.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).send({ message: 'Invalid status provided. Must be \'approved\' or \'rejected\'.' });
        }

        const overriddenLeaveRequest = await leaveService.overrideLeaveDecision(id, status, adminId);
        res.status(200).send({ message: 'Leave decision overridden successfully', leaveRequest: overriddenLeaveRequest });
    } catch (error) {
        res.status(500).send({ message: 'Error overriding leave decision', error: error.message });
        console.error(error);
    }
});

module.exports = router;
