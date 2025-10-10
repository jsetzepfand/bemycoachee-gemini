import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ConstructFactory } from '@aws-amplify/plugin-types';
import { aws_apigateway } from 'aws-cdk-lib';

// This is the CDK Construct that defines our backend infrastructure.
// It is not a full Stack, but a component that will be placed within the Amplify-managed stack.
export class BemycoacheeBackend extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const expressLambda = new NodejsFunction(this, 'BemycoacheeExpressLambda', {
      entry: path.join(__dirname, 'handler.ts'),
      handler: 'handler',
    });

    expressLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Query', 'dynamodb:PutItem'],
        resources: ['arn:aws:dynamodb:eu-central-1:315374878108:table/bemycoachee-chat-messages'],
      })
    );

    new RestApi(this, 'BemycoacheeRestApi', {
      restApiName: 'bemycoacheeAPI', // This is the API name your frontend is looking for
      defaultIntegration: new LambdaIntegration(expressLambda),
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });
  }
}

// This is the factory object that Amplify Gen 2 requires.
// It tells Amplify how to instantiate our custom construct.
export const factory: ConstructFactory<BemycoacheeBackend> = {
  getInstance: ({ backend }) => new BemycoacheeBackend(backend.stack, 'BemycoacheeBackend'),
};
