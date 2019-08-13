const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const { secret } = require('../config/environment');
const User = require('../models/user');


function secureRoute(req, res, next) {

  if(!req.headers.authorization) return res.unauthorized(); // here we say "if there's not header clearly you are not authorized"
  const token = req.headers.authorization.replace('Bearer ', '');

  jwt
   .verifyAsync(token, secret) // "yes this token has been made with this secret"
   .then((payload) => {
     return User.findById(payload.userId);
   })
   .then((user) => {
     if(!user) return res.unauthorized();
     req.user = user;
     return next();
   })
   .catch(next);
}
module.exports = secureRoute;

// 13 config/routes
