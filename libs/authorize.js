'use strict';

const dynamo = require('../libs/dynamo');
const jwt = require('jsonwebtoken');

module.exports = function (token, allowed, cb) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    dynamo.get(decoded.user, (err, user) => {
      if (user.Item) {
        if (allowed.indexOf(user.Item.role) !== -1) {
          // pass the user info, usefull in the service
          delete user.Item.password;
          delete user.Item.salt;
          return cb(null, user.Item);
        } else {
          return cb('notAllowed');
        }
      } else {
        return cb('notAllowed');
      }
    });
  } catch (err) {
    return cb(err);
  }

};