'use strict';

console.log('Loading microservice - user');

const register = require('./services/register');
const getUser = require('./services/user/get');
const editUser = require('./services/user/edit');
const login = require('./services/login');

exports.handler = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  /*
    switch (event.httpMethod) {
    case 'DELETE':
        //dynamo.deleteItem(JSON.parse(event.body), done);
      break;
    case 'GET':
        //dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
      break;
    case 'POST':
      break;
    case 'PUT':
        //dynamo.updateItem(JSON.parse(event.body), done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  */
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
    } else {
      done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  } else {
    done(new Error(`Unsupported method "${event.httpMethod}"`));

  }
};

