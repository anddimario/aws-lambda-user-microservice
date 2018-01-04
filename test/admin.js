'use strict';

const dynamo = require('../libs/dynamo')
const createPassword = require('../libs/createPassword')
const getUserAdmin = require('../services/admin/getUser');
const login = require('../services/login');


const admin = {
  email: 'testadmin@example.com',
  password: 'testpw1',
  fullname: 'Test Admin',
  role: 'admin'
};
const user = {
  email: 'test@example.com',
  fullname: 'Test User'
};
const password = 'testpw1';

describe('Admin', function () {
  this.token;

  // create the hashed password
  before((done) => {
    createPassword(password, (err, salt, password) => {
      if (err) return done(err);
      user.password = password;
      user.salt = salt;
      admin.password = password;
      admin.salt = salt;
      return done();
    });
  });
  // add the user and the admin
  before((done) => {
    return dynamo.put(admin, done);
  });
  before((done) => {
    return dynamo.put(user, done);
  });
  // login
  before((done) => {
    login({
      email: admin.email,
      password: password
    }, (err, token) => {
      if (err) return done(err);
      this.token = token.token;
      return done();
    });
  });


  it('should get user', (done) => {
    getUserAdmin({
      email: user.email
    }, this.token, (err, user) => {
      if (err) return done(err);
      return done();
    });
  });

  // remove the user and the admin
  after((done) => {
    return dynamo.delete(admin.email, done);
  });
  after((done) => {
    return dynamo.delete(user.email, done);
  });

});