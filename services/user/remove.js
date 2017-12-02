'use strict';

const authorize = require('../../libs/authorize');
const dynamo = require('../../libs/dynamo');

module.exports = (token, cb) => {
  authorize(token, ['user'], (err, user) => {
    if (err) {
      return cb(err);
    } else {
      dynamo.delete(user.email, (err) => {
        if (err) {
          return cb(err);
        } else {
          return cb(null, 'done');
        }

      });
    }
  });

};