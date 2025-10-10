import { defineBackend } from '@aws-amplify/backend';
import { defineFunction, defineApi } from '@aws-amplify/backend-rest-api';
import { Stack } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

// Create the Lambda function from the handler file
const expressLambda = defineFunction({
  entry: './api/handler.ts',
});

// Create the REST API and link it to the Lambda function
const api = defineApi({
  name: 'bemycoacheeAPI',
  paths: {
    '/messages': {
      handler: expressLambda,
    },
  },
});

// Create the backend definition
const backend = defineBackend({
  api,
});

// Grant the Lambda function access to the DynamoDB table
const cfnStack = Stack.of(backend.api.resources.stack);
const policy = new PolicyStatement({
  actions: ['dynamodb:Query', 'dynamodb:PutItem'],
  resources: ['arn:aws:dynamodb:eu-central-1:315374878108:table/bemycoachee-chat-messages'],
});

backend.api.resources.functions.bemycoacheeAPI.addToRolePolicy(policy);
