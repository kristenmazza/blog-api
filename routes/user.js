const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');

// Test route
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (req.user.admin) {
      next();
    } else {
      return res.status(401).send('No no... Unauthorized');
    }
  },
  (req, res, next) => {
    console.log(req);
    res.status(200).json({
      success: true,
      message: 'You are successfully authenticated to this route!',
    });
  }
);

// Get user
router.get('/:userId', user_controller.user_detail);

module.exports = router;
