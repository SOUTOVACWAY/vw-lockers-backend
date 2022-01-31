const jwt = require('express-jwt');
const secret = require('../config').secret;

function getToken(req){
  if ((req.headers.authorization &&
       req.headers.authorization.split(' ')[0] === 'Token') ||
      (req.headers.authorization &&
       req.headers.authorization.split(' ')[0] === 'Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

const auth = {
  getToken: getToken,
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getToken
  }),
  mustBeAdmin: function(req, res, next) {
    if (req.payload.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    next();
  }
};

module.exports = auth;
