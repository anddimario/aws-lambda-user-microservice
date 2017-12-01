const AWS = require('aws-sdk');
const authorize = require('../../libs/authorize');
const joi = require('joi');

AWS.config.update({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = (body, token, cb) => {
  // validation
  const validators = {
    fullname: joi.string().required(),
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

      dynamo.update({
        TableName: 'users',
        Key: {
          email: user.email,
        },
        UpdateExpression: 'SET fullname = :fullname',
        ExpressionAttributeValues: {
          ':fullname': body.fullname
        }
  
      }, (err) => {
        if (err) {
          return cb(err);
        } else {
          return cb(null, 'done');
        }

      });
    }
  });

};