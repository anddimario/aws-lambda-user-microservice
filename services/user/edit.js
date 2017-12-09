'use strict';

const authorize = require('../../libs/authorize');
const joi = require('joi');
const dynamo = require('../../libs/dynamo');

module.exports = (body, token, cb) => {
  // validation
  const validators = {
    fullname: joi.string().required(),
  };
  const schema = joi.object().keys(validators);
  const validation = joi.validate(body, schema);
  if (validation.error) {
    return cb(new Error(JSON.stringify(validation.error.details)));
  }
  authorize(token, ['user'], (err, user) => {
    if (err) {
      return cb(err);
    } else {
      const set = 'SET fullname = :fullname';
      const value = {
        ':fullname': body.fullname
      };
      dynamo.update(user.email, set, value, (err) => {
        if (err) {
          return cb(err);
        } else {
          return cb(null, 'done');
        }

      });
    }
  });

};
