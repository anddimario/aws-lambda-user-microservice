'use strict';

const authorize = require('../../libs/authorize');
const joi = require('joi');
const createPassword = require('../../libs/createPassword');
const dynamo = require('../../libs/dynamo');

module.exports = (body, token, cb) => {
  // validation
  const validators = {
    password: joi.string().required(),
  };
  const schema = joi.object().keys(validators);
  const validation = joi.validate(body, schema);
  if (validation.error) {
    return cb(new Error(validation.error.details));
  }
  authorize(token, ['user'], (err, user) => {
    if (err) {
      return cb(err);
    } else {

      createPassword(body.password, function (err, salt, password) {
        if (err) {
          return cb(err);
        } else {
          const set = 'SET password = :password, salt = :salt';
          const value = {
            ':password': password,
            ':salt': salt
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
    }
  });

};