const authorize = require('../libs/authorize');

module.exports = (token, cb) => {
  authorize(token, ['user'], (err, user) => {
    if (err) {
      return cb(err);
    } else {
      // return the same authorized user
      return cb(null, user);
    }
  });

};