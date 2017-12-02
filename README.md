aws lambda microservice for user manager    
**Status**: early alpha

### Features
- login/registration
- user: get profile, edit profile, edit password, remove

### Todo
- admin: add, list, get, edit and remove
- improvements

### Usage
- install aws-cli
- npm install -g node-lambda
- npm install aws-sdk joi jsonwebtoken
- install dynamodb local (for local tests) http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
- run: 
  ```aws dynamodb create-table --endpoint-url http://localhost:8000 --attribute-definitions AttributeName=email,AttributeType=S --key-schema AttributeName=email,KeyType=password --table-name users  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5```

### Required env variables
DYNAMO_REGION,DYNAMO_ENDPOINT,JWT_SECRET

### Endpoint informations
Registration body example (POST): 
```
{
  type: 'register',
  email: 'test@example.com',
  password: 'testpw1',
  fullname: 'Test User'
}
```
Login body example (POST):
```
{
  type: 'login',
  email: 'test@example.com',
  password: 'testpw1',
}
```
Edit user body example (POST - Token required):
```
{
  type: 'editUser',
  fullname: 'New user',
}
```
Edit password body example (POST - Token required):
```
{
  type: 'editPassword',
  password: 'password',
}
```

### Run locally
Create an event json, for example regEvent.json for registration:
```
{
  "body": "{\"email\":\"test@example.com\",\"password\":\"testpw1\",\"fullname\":\"Test User\",\"type\":\"register\"}",
  "httpMethod": "POST"
}
```
Run with node-lambda: `node-lambda run -H index.handler -j regEvent.json`

### Tests
- npm install -g mocha
- run: `DYNAMO_REGION=eu-west-1 DYNAMO_ENDPOINT=http://localhost:8000 JWT_SECRET=testmocha mocha --timeout 1000`   
Can create a bash script like this:
```
export DYNAMO_REGION=eu-west-1
export DYNAMO_ENDPOINT=http://localhost:8000
export JWT_SECRET=testmocha
mocha --timeout 1000
```
then run: bash test.sh

### Usefull things
Run local dynamodb: `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`    
List table from cli (needs aws cli install): `aws dynamodb list-tables --endpoint-url http://localhost:8000`

### Thanks
https://github.com/danilop/LambdAuth    
https://yos.io/2017/09/03/serverless-authentication-with-jwt/    
http://blog.rowanudell.com/testing-serverless-functions-locally/
