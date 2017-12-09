'use strict';

const crypto = require('crypto');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const dynamo = require('../libs/dynamo');

function computepassword(password, salt, cb) {
  // Bytesize
  const len = 128;
  const iterations = 4096;
  crypto.pbkdf2(password, salt, iterations, len, 'sha512', function (err, derivedKey) {
    if (err) return cb(err);
    cb(null, salt, derivedKey.toString('base64'));
  });
}

module.exports = (body, cb) => {

  const validators = {
    email: joi.string().email({ minDomainAtoms: 2 }).required(), // need minDomainAtoms to avoid local hostname and include tld
    password: joi.string().required(),
  };
  const schema = joi.object().keys(validators);
  const validation = joi.validate(body, schema);
  if (validation.error) {
    return cb(new Error(JSON.stringify(validation.error.details)));
  }

  dynamo.get(body.email, function (err, user) {
    if (err) {
      return cb(err);
    } else {
      if (!user.Item) {
        return cb(new Error('notFound'));
      } else {
        computepassword(body.password, user.Item.salt, function (err, salt, password) {
          if (err) {
            return cb(err);
          } else {
            if (password === user.Item.password) {
              const token = jwt.sign({ user: user.Item.email }, process.env.JWT_SECRET, { expiresIn: '2d' });
              return cb(null, { token });
            } else {
              return cb(new Error('notAllowed'));
            }
          }
        });
      }
    }
  });

};
