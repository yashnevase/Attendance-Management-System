const pool = require('../lib/dbConnection');
const authLib = require('../lib/auth');

const authService = {};

authService.login = async (username, password) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, password, role_id FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await authLib.comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = authLib.generateToken(user);
        return { token, user: { id: user.id, username: user.username, role_id: user.role_id } };
    } catch (error) {
        throw error;
    }
};

authService.register = async (name, username, password, role_id) => {
    try {
        const hashedPassword = await authLib.hashPassword(password);
        const [result] = await pool.execute('INSERT INTO users (name, username, password, role_id) VALUES (?, ?, ?, ?)', [name, username, hashedPassword, role_id]);
        return { id: result.insertId, name, username, role_id };
    } catch (error) {
        throw error;
    }
};

module.exports = authService;
