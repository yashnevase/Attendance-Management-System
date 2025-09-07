const express = require('express');
const router = express.Router();
const userService = require('../service/user_service');
const { verifyToken, checkRole } = require('../lib/auth');

// Admin can create Managers and Employees
router.post('/create', verifyToken, checkRole(['Admin']), async (req, res, next) => {
    try {
        const { name, username,email, password, role_id } = req.body;
        if (![2, 3].includes(role_id)) {
            return res.status(400).send({ message: 'Invalid role_id for user creation.' });
        }
        const newUser = await userService.createUser(name, username,email, password, role_id);
        res.status(201).send({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).send({ message: 'Error creating user', error: error.message });
        console.error(error);
    }
});

// Admin and Manager can view all Managers
router.get('/managers', verifyToken, checkRole(['Admin', 'Manager']), async (req, res, next) => {
    try {
        const managers = await userService.getUsersByRole(2);
        res.status(200).send({ message: 'Managers fetched successfully', users: managers });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching managers', error: error.message });
        console.error(error);
    }
});

// Admin and Manager can view all Employees
router.get('/employees', verifyToken, checkRole(['Admin', 'Manager']), async (req, res, next) => {
    try {
        const employees = await userService.getUsersByRole(3); 
        res.status(200).send({ message: 'Employees fetched successfully', users: employees });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching employees', error: error.message });
        console.error(error);
    }
});

router.get('/users', verifyToken, checkRole(['Admin']), async (req, res, next) => {
    try {
        const users = await userService.getUsersByRoleAll([3,2]); 
        res.status(200).send({ message: 'Users fetched successfully', users: users });
    } catch (error) {
        res.status(500).send({ message: 'Error fetching Users', error: error.message });
        console.error(error);
    }
});


module.exports = router;
