const express = require('express');
const router = express.Router();
const authService = require('../service/auth_service');


router.post('/register', async (req, res, next) => {
    try {
        const { name, username, password, role_id } = req.body;
        const newUser = await authService.register(name, username, password, role_id);
        res.status(201).send({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
        console.error(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const { token, user } = await authService.login(username, password);
        res.status(200).send({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(401).send({ message: 'Authentication failed', error: error.message });
        console.error(error);
    }
});

module.exports = router;
