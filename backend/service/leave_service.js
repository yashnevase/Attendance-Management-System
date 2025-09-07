const pool = require('../lib/dbConnection');
const { sendEmail } = require('../lib/email');
const leaveService = {};

leaveService.submitLeaveRequest = async (userId, leaveTypeId, startDate, endDate, reason) => {
    try {
        const [result] = await pool.execute(
            'INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, leaveTypeId, startDate, endDate, reason, 'pending']
        );
        return { id: result.insertId, userId, leaveTypeId, startDate, endDate, reason, status: 'pending' };
    } catch (error) {
        throw error;
    }
};

leaveService.getLeaveHistory = async (userId) => {
    try {
        const [rows] = await pool.execute(
            `SELECT lr.id, lt.name AS leave_type, lr.start_date, lr.end_date, lr.reason, lr.status, lr.manager_comment, lr.admin_override, lr.created_at
            FROM leave_requests lr
            JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE lr.user_id = ?
            ORDER BY lr.created_at DESC`,
            [userId]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// leaveService.updateLeaveRequestStatus = async (leaveId, status, managerComment, managerId) => {
//     try {
//         
//         const [result] = await pool.execute(
//             'UPDATE leave_requests SET status = ?, manager_comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//             [status, managerComment, leaveId]
//         );
//         if (result.affectedRows === 0) {
//             throw new Error('Leave request not found or no changes made.');
//         }
//         return { id: leaveId, status, managerComment, managerId };
//     } catch (error) {
//         throw error;
//     }
// };

leaveService.updateLeaveRequestStatus = async (leaveId, status, managerComment, managerId) => {
    try {

        const [updateResult] = await pool.execute(
            `UPDATE leave_requests 
             SET status = ?, manager_comment = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [status, managerComment, leaveId]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('Leave request not found or no changes made.');
        }


        const [leaveRows] = await pool.execute(
            `SELECT lr.id, lr.status, lr.start_date, lr.end_date, lr.reason, u.name, u.email 
                FROM leave_requests lr
                JOIN users u ON lr.user_id = u.id
                WHERE lr.id = ?`,
            [leaveId]
        );

        if (leaveRows.length === 0) {
            throw new Error('Leave request or user not found.');
        }

        const { name, email ,start_date, end_date, reason } = leaveRows[0];

        // foramt date 
        function formatDate(isoDate) {
            const d = new Date(isoDate);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        }

        const formattedStartDate = formatDate(start_date);
        const formattedEndDate = formatDate(end_date);


        // Send email 
        const subject = `Your Leave Request has been ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const html = `
                <p>Dear ${name},</p>
                <p>Your leave request has been <strong>${status}</strong> by your manager.</p>
                <p><strong>Leave Dates:</strong> ${formattedStartDate} to ${formattedEndDate}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                ${managerComment ? `<p><strong>Manager's Comment:</strong> ${managerComment}</p>` : ''}
                <p>Regards,<br/>Manager</p>
            `;

        await sendEmail(email, subject, html);

        return { id: leaveId, status, managerComment, managerId };
    } catch (error) {
        console.error('Error in updateLeaveRequestStatus:', error);
        throw error;
    }
};



// leaveService.overrideLeaveDecision = async (leaveId, status, adminId) => {
//     try {
//         const [result] = await pool.execute(
//             'UPDATE leave_requests SET status = ?, admin_override = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//             [status, leaveId]
//         );
//         if (result.affectedRows === 0) {
//             throw new Error('Leave request not found or no changes made.');
//         }

//         return { id: leaveId, status, admin_override: true, adminId };
//     } catch (error) {
//         throw error;
//     }
// };

leaveService.overrideLeaveDecision = async (leaveId, status, adminId) => {
    try {

        const [updateResult] = await pool.execute(
            `UPDATE leave_requests 
             SET status = ?, admin_override = 1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [status, leaveId]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('Leave request not found or no changes made.');
        }


        const [leaveRows] = await pool.execute(
                `SELECT lr.id, lr.status, lr.start_date, lr.end_date, lr.reason, u.name, u.email 
                FROM leave_requests lr
                JOIN users u ON lr.user_id = u.id
                WHERE lr.id = ?`,
                [leaveId]
            );


        if (leaveRows.length === 0) {
            throw new Error('Leave request or user not found.');
        }

        const { name, email, start_date, end_date, reason } = leaveRows[0];

        // format date 
        function formatDate(isoDate) {
            const d = new Date(isoDate);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        }

        const formattedStartDate = formatDate(start_date);
        const formattedEndDate = formatDate(end_date);



        // Send email 
        const subject = `Your Leave Request has been ${status.charAt(0).toUpperCase() + status.slice(1)}`;
        const html = `
                <p>Dear ${name},</p>
                <p>Your leave request has been <strong>${status}</strong> by the Admin.</p>
                <p><strong>Leave Dates:</strong> ${formattedStartDate} to ${formattedEndDate}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p>Regards,<br/>Admin</p>
            `;

        await sendEmail(email, subject, html);

        return { id: leaveId, status, admin_override: true, adminId };
    } catch (error) {
        console.error('Error in overrideLeaveDecision:', error);
        throw error;
    }
};


leaveService.getAllLeaveRequests = async () => {
    try {
        const [rows] = await pool.execute(
            `SELECT lr.id, u.username, lt.name AS leave_type, lr.start_date, lr.end_date, lr.reason, lr.status, lr.manager_comment, lr.admin_override, lr.created_at
            FROM leave_requests lr
            JOIN users u ON lr.user_id = u.id
            JOIN leave_types lt ON lr.leave_type_id = lt.id
            ORDER BY lr.created_at DESC`
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

leaveService.getEmployeeLeaveRequestsForManager = async () => {
    try {
        const [rows] = await pool.execute(
            `SELECT lr.id, u.username, lt.name AS leave_type, lr.start_date, lr.end_date, lr.reason, lr.status, lr.manager_comment, lr.admin_override, lr.created_at
            FROM leave_requests lr
            JOIN users u ON lr.user_id = u.id
            JOIN leave_types lt ON lr.leave_type_id = lt.id
            WHERE u.role_id = 3  -- Assuming role_id 3 is Employee
            ORDER BY lr.created_at DESC`
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

leaveService.getLeaveTypes = async () => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name FROM leave_types'
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = leaveService;
