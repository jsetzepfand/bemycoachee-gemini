import { defineBackend } from '@aws-amplify/backend';
import { factory as bemycoacheeApiFactory } from './api/resource';

// This is the main backend definition file.
// We are passing a dictionary of resources directly to defineBackend.
// The key 'bemycoacheeAPI' will be used to name the resource in the generated outputs.
defineBackend({
  bemycoacheeAPI: bemycoacheeApiFactory,
});
