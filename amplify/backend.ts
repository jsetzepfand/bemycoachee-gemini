import { defineBackend } from "@aws-amplify/backend";
import {
  HttpApi, HttpMethod, CorsHttpMethod
} from "aws-cdk-lib/aws-apigatewayv2";
import {
  HttpLambdaIntegration
} from "aws-cdk-lib/aws-apigatewayv2-integrations";
import {
  HttpIamAuthorizer, HttpUserPoolAuthorizer
} from "aws-cdk-lib/aws-apigatewayv2-authorizers";


// 1. Define the backend
const backend = defineBackend({
  // 2. Define the HTTP API resource
  api: defineHttpApi({
    name: 'bemycoacheeAPI', // This is the API name the frontend will use
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

// 5. Set a default authorization rule for the API to allow public access
backend.api.resources.cfnResources.cfnHttpApi.defaultAuthorization = {
  authorizationType: 'NONE',
};
