'use strict';

console.log('Loading microservice - user');

// user
const register = require('./services/register');
const getUser = require('./services/user/get');
const removeUser = require('./services/user/remove');
const editUser = require('./services/user/edit');
const editPassword = require('./services/user/editPassword');
const login = require('./services/login');
// admin
const getUserAdmin = require('./services/admin/getUser');

exports.handler = (event, context, callback) => {

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? JSON.stringify({ error: err.message }) : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (event.httpMethod === 'GET') {
    const query = event.queryStringParameters;
    const type = query.type;
    delete query.type;
    if (type === 'getUser') {
      getUser(event.headers.Authorization, done);
    } else if (type === 'getUserAdmin') {
      getUserAdmin(event.queryStringParameters, event.headers.Authorization, done);
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

