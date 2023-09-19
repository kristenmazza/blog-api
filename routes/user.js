const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

// Get user
router.get('/:userId', user_controller.user_detail);

module.exports = router;
