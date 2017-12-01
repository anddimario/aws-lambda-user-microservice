'use strict';

const AWS = require('aws-sdk');
const crypto = require('crypto');
const joi = require('joi');

AWS.config.update({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();

function computeHash(password, cb) {
  // Bytesize
  const len = 128;
  const iterations = 4096;
  crypto.randomBytes(len, function (err, salt) {
    if (err) return cb(err);
    salt = salt.toString('base64');
    
    crypto.pbkdf2(password, salt, iterations, len, 'sha512', function (err, derivedKey) {
      if (err) return cb(err);
      cb(null, salt, derivedKey.toString('base64'));
    });
  });
}

function storeUser(user, cb) {
  dynamo.put({
    TableName: 'users',
    Item: user,
    ConditionExpression: 'attribute_not_exists (email)'
  }, cb);
}

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
  computeHash(body.password, function (err, salt, hash) {
    if (err) {
      return cb(err);
    } else {
      user.hash = hash;
      user.salt = salt;
      storeUser(user, function (err) {
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