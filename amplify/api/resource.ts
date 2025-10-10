import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ConstructFactory, ResourceProvider } from '@aws-amplify/plugin-types';

// This is the internal CDK Stack that defines the infrastructure.
class ExpressBackendStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    const api = new RestApi(this, 'BemycoacheeRestApi', {
      restApiName: 'bemycoacheeAPI',
      defaultCorsPreflightOptions: {
        allowOrigins: cdk.aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: cdk.aws_apigateway.Cors.ALL_METHODS,
      },
    });

    const lambdaIntegration = new LambdaIntegration(expressLambda);
    const messagesResource = api.root.addResource('messages');
    messagesResource.addMethod('GET', lambdaIntegration);
    messagesResource.addMethod('POST', lambdaIntegration);

    this.apiUrl = api.url;
  }
}

// This is the factory object that Amplify Gen 2 requires.
// It implements the ConstructFactory interface and creates an instance of our stack.
export const ExpressBackendFactory: ConstructFactory<ResourceProvider> = {
  getInstance: ({ backend }) => {
    const stack = new ExpressBackendStack(backend.stack, 'BemycoacheeExpressStack');
    return {
      resources: {
        restApi: stack.apiUrl,
      },
    };
  },
};
