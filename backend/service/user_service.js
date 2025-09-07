const pool = require('../lib/dbConnection');
const authLib = require('../lib/auth');

const userService = {};

userService.createUser = async (name, username,email, password, role_id) => {
    try {
        // First, check if the username already exists
        const [existingUsers] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await authLib.hashPassword(password);
        const [result] = await pool.execute('INSERT INTO users (name, username,email, password, role_id) VALUES (?, ?, ?, ?, ?)', [name, username,email, hashedPassword, role_id]);
        return { id: result.insertId, name, username, role_id };
    } catch (error) {
        throw error;
    }
};

userService.getUsersByRole = async (role_id) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, username, role_id FROM users WHERE role_id = ?', [role_id]);
        return rows;
    } catch (error) {
        throw error;
    }
};

userService.getUsersByRoleAll = async (role_ids) => {
    try {
        const placeholders = role_ids.map(() => '?').join(', ');
       const query = `SELECT id, name, username, role_id FROM users WHERE role_id IN (${placeholders})`;
        const [rows] = await pool.execute(query, role_ids);
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = userService;
