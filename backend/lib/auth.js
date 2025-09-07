const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        role_id: user.role_id
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.user = decoded; //user payload 
        next();
    });
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role_id) {
            return res.status(401).send({ message: 'Unauthorized: User role not found.' });
        }

        const userRoleId = req.user.role_id;

        const roleMap = {
            1: 'Admin',
            2: 'Manager',
            3: 'Employee',
        };
        const userRoleName = roleMap[userRoleId];

        if (!userRoleName || !roles.includes(userRoleName)) {
            return res.status(403).send({ message: 'Forbidden: You do not have the required role.' });
        }
        next();
    };
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword, checkRole };
