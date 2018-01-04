'use strict';

const authorize = require('../../libs/authorize');
const joi = require('joi');
const dynamo = require('../../libs/dynamo');

module.exports = (query, token, cb) => {
  // validation
  const validators = {
    email: joi.string().email({ minDomainAtoms: 2 }).required(), // need minDomainAtoms to avoid local hostname and include tld
  };
  const schema = joi.object().keys(validators);
  const validation = joi.validate(query, schema);
  if (validation.error) {
    return cb(new Error(JSON.stringify(validation.error.details)));
  }
  authorize(token, ['admin'], (err) => {
    if (err) {
      return cb(err);
    } else {
      dynamo.get(query.email, (err, docs) => {
        const user = docs.Item;
        delete user.password;
        delete user.salt;
        if (err) {
          return cb(err);
        } else {
          return cb(null, user);
        }

      });
    }
  });

};
