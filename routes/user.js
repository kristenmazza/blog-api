const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');

// Test route
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      message: 'You are successfully authenticated to this route!',
    });
  }
);

// User registration
router.post('/signup', user_controller.user_create);

// User login
router.post('/login', user_controller.user_login);

module.exports = router;
