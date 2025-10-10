import { defineApi, defineFunction } from '@aws-amplify/backend';
import { handler } from './handler';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

// Defines the API resource and its handler
export const api = defineApi({
  name: 'bemycoacheeAPI',
  functions: {
    bemycoacheeMessages: defineFunction({
      entry: './handler.ts',
    }),
  },
  paths: {
    '/messages': {
      handler: 'bemycoacheeMessages',
      auth: { allow: 'public' },
    },
  },
});

// Grant the Lambda function access to the specific DynamoDB table
// This creates a new IAM policy and attaches it to the function's execution role.
api.functions.bemycoacheeMessages.attachRolePolicy(
  new Policy(api.stack, 'DynamoDBReadWritePolicy', {
    statements: [
      new PolicyStatement({
        actions: [
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        // IMPORTANT: Replace YOUR_AWS_ACCOUNT_ID and YOUR_TABLE_NAME with your actual values
        // You can find your Account ID in the top-right corner of the AWS Console.
        // The table name is 'bemycoachee-chat-messages'
        resources: ['arn:aws:dynamodb:eu-central-1:315374878108:table/bemycoachee-chat-messages'],
      }),
    ],
  })
);
