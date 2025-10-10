import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

// This is a custom CDK stack that defines our Express backend infrastructure.
export class ExpressBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Define the Lambda function that will run our Express app
    const expressLambda = new NodejsFunction(this, 'BemycoacheeExpressLambda', {
      entry: path.join(__dirname, 'handler.ts'), // Points to our Express handler file
      handler: 'handler', // The exported object from handler.ts
    });

    // 2. Grant the Lambda function permission to access the DynamoDB table
    expressLambda.addToRolePolicy(
      new PolicyStatement({
        actions: [
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
        ],
        // The ARN (Amazon Resource Name) of your specific DynamoDB table.
        resources: ['arn:aws:dynamodb:eu-central-1:315374878108:table/bemycoachee-chat-messages'],
      })
    );

    // 3. Define the API Gateway REST API
    const api = new RestApi(this, 'BemycoacheeRestApi', {
      restApiName: 'bemycoacheeAPI', // This is the API name your frontend is looking for
      defaultCorsPreflightOptions: {
        allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
      },
    });

    // 4. Create an integration between the API Gateway and the Lambda function
    const lambdaIntegration = new LambdaIntegration(expressLambda);

    // 5. Define the /messages resource and its methods
    const messagesResource = api.root.addResource('messages');
    messagesResource.addMethod('GET', lambdaIntegration); // GET /messages -> Lambda
    messagesResource.addMethod('POST', lambdaIntegration); // POST /messages -> Lambda
  }
}
