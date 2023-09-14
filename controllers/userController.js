const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
exports.user_create = [
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
        res.json(result);
      });
    } catch (err) {
      return next(err);
    }
  }),
];

// User login
exports.user_login = [
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

    // Find user based on username
    const user = await User.findOne({ username: req.body.username });

    try {
      // Compare password received in request with hashed one in database
      const match = await bcrypt.compare(req.body.password, user.password);

      // Create token using JWT by passing in user data and token secret
      const accessToken = jwt.sign(
        JSON.stringify(user),
        process.env.TOKEN_SECRET
      );

      // If match is true, return token in JSON format
      if (match) {
        res.json({ accessToken: accessToken });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    } catch (err) {
      console.log(err);
    }
  }),
];
