const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

AWS.config.update({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = function (token, allowed, cb) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    dynamo.get({
      TableName: 'users',
      Key: { email: decoded.user },
    }, (err, user) => {
      if (user.Item) {
        if (allowed.indexOf(user.Item.role) !== -1) {
          // pass the user info, usefull in the service
          delete user.Item.hash;
          delete user.Item.salt;
          return cb(null, user.Item);
        } else {
          return cb('notAllowed');
        }
      } else {
        return cb('notAllowed');
      }
    });
  } catch (err) {
    return cb(err);
  }

};