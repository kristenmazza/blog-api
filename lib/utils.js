const jsonwebtoken = require('jsonwebtoken');

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expiresIn,
  });

  return {
    token: 'Bearer ' + signedToken,
    expiresIn: expiresIn,
  };
}

module.exports.issueJWT = issueJWT;
