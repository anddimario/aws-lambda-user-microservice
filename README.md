aws lambda microservice for user manager

### Todo
- Status: under development
- user: edit, remove
- admin: add, list, get, edit and remove
- online tests with API Gateway
- improve readme

### Usage
- npm install -g node-lambda
- npm install aws-sdk joi jsonwebtoken
- install dynamodb local (for local test) http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
- run: 
  ```aws dynamodb create-table --endpoint-url http://localhost:8000 --attribute-definitions AttributeName=email,AttributeType=S --key-schema AttributeName=email,KeyType=HASH --table-name users  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5```

### Required env variables
DYNAMO_REGION,DYNAMO_ENDPOINT,JWT_SECRET

### Endpoint informations
Registration body example (POST): 
```
{
  type: 'register',
  email: 'test@example.com',
  password: 'testpw1',
  name: 'Test User'
}
```
Login body example (POST):
{
  type: 'login',
  email: 'test@example.com',
  password: 'testpw1',
}
```

### Tests
npm install -g mocha
```DYNAMO_REGION=eu-west-1 DYNAMO_ENDPOINT=http://localhost:8000 JWT_SECRET=testmocha mocha --timeout 1000```
Can create a bash script like test.sh:
```
export DYNAMO_REGION=eu-west-1
export DYNAMO_ENDPOINT=http://localhost:8000
export JWT_SECRET=testmocha
mocha --timeout 1000
```
then run: bash test.sh

### Usefull things
aws dynamodb list-tables --endpoint-url http://localhost:8000


### Thanks
https://github.com/danilop/LambdAuth
https://yos.io/2017/09/03/serverless-authentication-with-jwt/