const crypto = require('crypto');

module.exports = function (password, cb) {
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
};