import { defineBackend } from '@aws-amplify/backend';
import { ExpressBackendStack } from './api/resource';

// This is the main backend definition file.
const backend = defineBackend({
  // We are defining our Express backend as a custom resource using the CDK stack we created.
  // The name 'BemycoacheeExpressStack' is an identifier for this resource within the Amplify project.
  BemycoacheeExpressStack: new ExpressBackendStack(this, 'BemycoacheeExpressStack'),
});
