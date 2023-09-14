const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

// User registration
router.post('/signup', user_controller.user_create);

// User login
router.post('/login', user_controller.user_login);

// router.get('/logout', (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.json({ message: 'Logged out' });
//   });
// });

module.exports = router;
