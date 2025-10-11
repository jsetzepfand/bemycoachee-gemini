import { defineBackend } from '@aws-amplify/backend';
import { defineHttpApi } from '@aws-amplify/backend-http';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

// 1. Define the backend
const backend = defineBackend({
  // 2. Define the HTTP API resource
  api: defineHttpApi({
    name: 'bemycoacheeAPI',
    // 3. Define the handler function for all paths
    handler: {
      entry: './api/handler.ts',
      // 4. Grant the function access to the DynamoDB table
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

// 5. Set a default authorization rule for the API
backend.api.resources.cfnResources.cfnHttpApi.defaultAuthorization = {
  authorizationType: 'NONE',
};
