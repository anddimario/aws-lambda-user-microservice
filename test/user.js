'use strict';

const AWS = require('aws-sdk');

AWS.config.update({
  endpoint: process.env.DYNAMO_ENDPOINT,
  region: process.env.DYNAMO_REGION
});

const dynamo = new AWS.DynamoDB.DocumentClient();
const register = require('../services/register');
const getUser = require('../services/getUser');
const login = require('../services/login');

const user = {
  email: 'test@example.com',
  password: 'testpw1',
  name: 'Test User'
};

describe('User', function () {
  this.token;

  it('should register', (done) => {
    register(user, (err) => {
      if (err) return done(err);
      return done();
    });

  });

  it('should not register the same', (done) => {
    register(user, (err) => {
      if (err) return done();
      return done(new Error('registredTheSame'));
    });

  });


  it('should login', (done) => {
    login({
      email: user.email,
      password: user.password
    }, (err, token) => {
      this.token = token.token;
      if (err) return done(err);
      return done();
    });

  });

  it('should not login - wrong user', (done) => {
    login({
      email: 'wrong@example.com',
      password: user.password
    }, (err) => {
      if (err) return done();
      return done(new Error('loggedWithWrongUser'));
    });

  });

  it('should not login - wrong user', (done) => {
    login({
      email: 'wrong@example.com',
      password: user.password
    }, (err) => {
      if (err) return done();
      return done(new Error('loggedWithWrongUser'));
    });

  });

  it('should not login - wrong password', (done) => {
    login({
      email: user.email,
      password: 'wrongpassword'
    }, (err) => {
      if (err) return done();
      return done(new Error('loggedWithWrongPassword'));
    });

  });

  it('should get user', (done) => {
    getUser(this.token, (err, user) => {
      if (err) return done(err);
      return done();
    });

  });

  after((done) => {
    return dynamo.delete({
      TableName: 'users',
      Key: {
        email: 'test@example.com'
      }
    }, done);
  });

});