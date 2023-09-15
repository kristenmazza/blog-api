const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');

// test
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

// router.get('/logout', (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.json({ message: 'Logged out' });
//   });
// });
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // If bearer exists, split at the space
  const token = bearerHeader && bearerHeader.split(' ')[1];

  // If it does not exist, send error status
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
