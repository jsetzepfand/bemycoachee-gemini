import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ConstructFactory, ResourceProvider } from '@aws-amplify/plugin-types';
import { Stack, aws_apigateway } from 'aws-cdk-lib';

// This is the CDK Construct that defines our backend infrastructure.
// It correctly implements the ResourceProvider interface.
class BemycoacheeApiConstruct extends Construct implements ResourceProvider {
  // The 'resources' property is what makes this a valid ResourceProvider.
  public readonly resources: {
    restApi: RestApi;
  };

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

    const api = new RestApi(this, 'BemycoacheeRestApi', {
      restApiName: 'bemycoacheeAPI',
      defaultIntegration: new LambdaIntegration(expressLambda),
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
      },
    });

    api.root.addProxy({ anyMethod: true });

    this.resources = {
      restApi: api,
    };
  }
}

// This is the factory object that Amplify Gen 2 requires.
// It correctly uses the constructContainer to get the parent stack.
export const factory: ConstructFactory<ResourceProvider> = {
  getInstance: ({ constructContainer }) => {
    const stack = constructContainer.getStack(BemycoacheeApiConstruct.name);
    return new BemycoacheeApiConstruct(stack, 'BemycoacheeApi');
  },
};
