'use strict';

const joi = require('joi');
const createPassword = require('../libs/createPassword');
const dynamo = require('../libs/dynamo');

module.exports = (body, cb) => {
  const validators = {
    email: joi.string().email({ minDomainAtoms: 2 }).required(), // need minDomainAtoms to avoid local hostname and include tld
    password: joi.string().required(),
    fullname: joi.string().required(),
  };
  const schema = joi.object().keys(validators);
  const validation = joi.validate(body, schema);
  if (validation.error) {
    return cb(new Error(validation.error.details));
  }

  const user = {
    email: body.email,
    fullname: body.fullname,
    role: 'user'
  };
  createPassword(body.password, function (err, salt, password) {
    if (err) {
      return cb(err);
    } else {
      user.password = password;
      user.salt = salt;
      dynamo.put(user, function (err) {
        if (err) {
          if (err.code === 'ConditionalCheckFailedException') {
            return cb(new Error('alreadyExists'));
          } else {
            return cb(err);
          }
        } else {
          return cb(null, {success: true});
        }
      });
    }
  });

};