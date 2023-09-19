const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authController');

// User registration
router.post('/register', auth_controller.register);

// User login
router.post('/login', auth_controller.login);

module.exports = router;
