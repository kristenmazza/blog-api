require('dotenv').config();
const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: process.env.TOKEN_SECRET,
};

// Strategy takes options, gets JWT from authorization header,
// and validates JWT with JWT webtoken library.
// Once validated, it passes payload object.
const strategy = new JwtStrategy(opts, (payload, done) => {
  // Get ID of user from payload sub object.
  User.findOne({ _id: payload.sub })
    .then((user) => {
      // Look up id in database, return it to passport, then passport
      // attaches it to req.user object within Express framework.
      // Only users with admin status are returned
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, false));
});

module.exports = (passport) => {
  passport.use(strategy);
};
