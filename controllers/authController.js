const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');

// User registration
exports.register = [
  // Validate and sanitize fields
  body('username')
    .trim()
    .isEmail()
    .withMessage('Email is not valid')
    .notEmpty()
    .withMessage('Email cannot be blank')
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error('A user already exists with this email');
      }
    }),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters'),
  body('c_password')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match'),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // Store hashed password in database
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: false,
        });

        const result = await user.save();
        const jwt = utils.issueJWT(user);
        res.json({
          success: true,
          result,
          token: jwt.token,
          expiresIn: jwt.expiresIn,
        });
      });
    } catch (err) {
      return next(err);
    }
  }),
];

// User login
exports.login = [
  // Validate and sanitize fields
  body('username')
    .trim()
    .isEmail()
    .withMessage('Email is not valid')
    .notEmpty()
    .withMessage('Email cannot be blank'),
  body('password').notEmpty().withMessage('Password cannot be blank'),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find user based on username
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        res
          .status(401)
          .json({ success: false, message: 'Could not find user' });
      }

      // Compare password received in request with hashed one in database
      const isValid = await bcrypt.compare(req.body.password, user.password);

      if (isValid) {
        // If password is valid, issue token
        const tokenObject = utils.issueJWT(user);
        res.json({
          success: true,
          user,
          token: tokenObject.token,
          expiresIn: tokenObject.expiresIn,
        });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    } catch (err) {
      next(err);
    }
  }),
];
