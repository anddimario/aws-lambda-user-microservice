'use strict';

const AWS = require('aws-sdk');
const crypto = require('crypto');
const joi = require('joi');
const jwt = require('jsonwebtoken');

AWS.config.update({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();

function computeHash(password, salt, cb) {
  // Bytesize
  const len = 128;
  const iterations = 4096;
  crypto.pbkdf2(password, salt, iterations, len, 'sha512', function (err, derivedKey) {
    if (err) return cb(err);
    cb(null, salt, derivedKey.toString('base64'));
  });
}

function getUser(email, cb) {
  dynamo.get({
    TableName: 'users',
    Key: { email: email },
  }, cb);
}

module.exports = (body, cb) => {

  const validators = {
    email: joi.string().email({ minDomainAtoms: 2 }).required(), // need minDomainAtoms to avoid local hostname and include tld
    password: joi.string().required(),
  };
  const schema = joi.object().keys(validators);
  const validation = joi.validate(body, schema);
  if (validation.error) {
    return cb(new Error(validation.error.details));
  }

  getUser(body.email, function (err, user) {
    if (err) {
      return cb(err);
    } else {
      if (!user.Item) {
        return cb(new Error('notFound'));
      } else {
        computeHash(body.password, user.Item.salt, function (err, salt, hash) {
          if (err) {
            return cb(err);
          } else {
            if (hash === user.Item.hash) {
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