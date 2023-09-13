const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const models = require('./models');
const routes = require('./routes');
require('dotenv').config();
const mongoose = require('mongoose');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  next();
});

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/posts', routes.post);

module.exports = app;
