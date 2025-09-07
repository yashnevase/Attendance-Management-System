const pool = require('../lib/dbConnection');

const attendanceService = {};

attendanceService.checkIn = async (userId) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const [existingCheckIn] = await pool.execute(
            'SELECT id FROM attendance WHERE user_id = ? AND DATE(check_in) = ?',
            [userId, today]
        );

        if (existingCheckIn.length > 0) {
            throw new Error('Already checked in for today.');
        }

        const [result] = await pool.execute(
            'INSERT INTO attendance (user_id, check_in) VALUES (?, CURRENT_TIMESTAMP)',
            [userId]
        );
        return { id: result.insertId, userId, check_in: new Date() };
    } catch (error) {
        throw error;
    }
};

attendanceService.checkOut = async (userId) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const [existingCheckIn] = await pool.execute(
            'SELECT id, check_in FROM attendance WHERE user_id = ? AND DATE(check_in) = ? AND check_out IS NULL',
            [userId, today]
        );

        if (existingCheckIn.length === 0) {
            throw new Error('No active check-in found for today.');
        }

        const attendanceId = existingCheckIn[0].id;
        const checkInTime = new Date(existingCheckIn[0].check_in);
        const checkOutTime = new Date();
        const totalHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2);


        const [result] = await pool.execute(
            'UPDATE attendance SET check_out = CURRENT_TIMESTAMP, total_hours = ? WHERE id = ?',
            [totalHours, attendanceId]
        );

        if (result.affectedRows === 0) {
            throw new Error('Failed to update check-out.');
        }

        return { id: attendanceId, userId, check_out: checkOutTime, total_hours: parseFloat(totalHours) };
    } catch (error) {
        throw error;
    }
};

attendanceService.getDailyAttendance = async (userId, date = null) => {
    try {
        let query = `SELECT id, check_in, check_out, total_hours, created_at FROM attendance WHERE user_id = ?`;
        const params = [userId];

        if (date) {
            query += ` AND DATE(check_in) = ?`;
            params.push(date);
        }

        query += ` ORDER BY check_in DESC`;

        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        throw error;
    }
};


attendanceService.getAttendanceReport = async (userId, startDate = null, endDate = null) => {
    let query = `SELECT id, check_in, check_out, total_hours, created_at FROM attendance WHERE user_id = ?`;
    const params = [userId];

    if (startDate && endDate) {
        query += ` AND DATE(check_in) BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }

    query += ` ORDER BY check_in DESC`;

    const [rows] = await pool.execute(query, params);
    return rows;
};







module.exports = attendanceService;
