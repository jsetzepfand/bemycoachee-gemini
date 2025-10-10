import { defineBackend } from '@aws-amplify/backend';
import { ExpressBackendFactory } from './api/resource';

// This is the main backend definition file.
const backend = defineBackend();

// Use the .add() method to integrate the custom resource factory.
// This tells Amplify to execute the getInstance method from our factory
// to create the underlying CDK stack.
backend.add(ExpressBackendFactory);
