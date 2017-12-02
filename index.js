'use strict';

console.log('Loading microservice - user');

const register = require('./services/register');
const getUser = require('./services/user/get');
const removeUser = require('./services/user/remove');
const editUser = require('./services/user/edit');
const login = require('./services/login');

exports.handler = (event, context, callback) => {

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (event.httpMethod === 'GET') {
    const type = event.queryStringParameters.type;
    if (type === 'getUser') {
      getUser(event.headers.Authorization, done);
    } else {
      done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  } else if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);
    const type = body.type;
    delete body.type;
    if (type === 'register') {
      register(body, done);
    } else if (type === 'login') {
      login(body, done);
    } else if (type === 'editUser') {
      editUser(body, event.headers.Authorization, done);
    } else if (type === 'editPassword') {
      editPassword(body, event.headers.Authorization, done);
    } else {
      done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  } else if (event.httpMethod === 'POST') {
    const type = event.queryStringParameters.type;
    if (type === 'removeUser') {
      removeUser(event.headers.Authorization, done);
    } else {
      done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  } else {
    done(new Error(`Unsupported method "${event.httpMethod}"`));

  }
};

