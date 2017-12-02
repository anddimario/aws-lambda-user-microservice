const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.put = function (user, cb) {
  dynamo.put({
    TableName: 'users',
    Item: user,
    ConditionExpression: 'attribute_not_exists (email)'
  }, cb);
};

exports.get = function (email, cb) {
  dynamo.get({
    TableName: 'users',
    Key: { email: email },
  }, cb);
};

exports.update = function (key, set, value, cb) {
  dynamo.update({
    TableName: 'users',
    Key: {
      email: key,
    },
    UpdateExpression: set,
    ExpressionAttributeValues: value
  }, cb);
};

exports.delete = function (email, cb) {
  dynamo.delete({
    TableName: 'users',
    Key: { email: email },
  }, cb);
};