import { defineBackend } from '@aws-amplify/backend';
import { defineRestApi } from '@aws-amplify/backend-rest-api';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
// 1. Define the backend
const backend = defineBackend({
    // 2. Define the REST API resource
    api: defineRestApi({
        name: 'bemycoacheeAPI',
        paths: {
            // 3. Define the handler function for the /messages path
            '/messages': {
                entry: './api/handler.ts',
                // 4. Grant the function access to the DynamoDB table
                rolePolicies: [
                    (grant) => grant.addStatements(new PolicyStatement({
                        actions: ['dynamodb:Query', 'dynamodb:PutItem'],
                        resources: ['arn:aws:dynamodb:eu-central-1:315374878108:table/bemycoachee-chat-messages'],
                    })),
                ],
            },
        },
    }),
});
