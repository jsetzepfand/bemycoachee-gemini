import { defineBackend } from '@aws-amplify/backend';
import { defineApi } from '@aws-amplify/backend-rest-api';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

// 1. Define the backend
const backend = defineBackend({
  // 2. Define the API resource
  api: defineApi({
    // 3. Define the handler function and grant it permissions
    handler: {
      entry: './api/handler.ts',
      // Grant the function access to the specific DynamoDB table
      rolePolicies: [
        (grant) =>
          grant.addStatements(
            new PolicyStatement({
              actions: ['dynamodb:Query', 'dynamodb:PutItem'],
              resources: ['arn:aws:dynamodb:eu-central-1:315374878108:table/bemycoachee-chat-messages'],
            })
          ),
      ],
    },
  }),
});

// 4. Set the API name and proxy all requests to the handler
backend.api.resources.restApi.restApiName = 'bemycoacheeAPI';
backend.api.resources.restApi.root.addProxy({ anyMethod: true });
