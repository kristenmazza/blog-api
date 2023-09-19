const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config();

// Removes prepatory warnings for Mongoose 7.
mongoose.set('strictQuery', false);

// Define the database URL to connect to.
const mongoDB = process.env.MONGODB_URI;

// Wait for database to connect, logging an error if there is a problem.
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Passport authentication
require('./config/auth')(passport);
app.use(passport.initialize());

// Gives access to currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use('/users', routes.user);
app.use('/posts', routes.post);
app.use('/auth', routes.auth);

// For multer file upload errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'File must be an image',
      });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large',
      });
    }
  }
});

// Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
