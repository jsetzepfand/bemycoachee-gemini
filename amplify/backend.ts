import { defineBackend } from '@aws-amplify/backend';
import { api } from './api/resource'; // Import the API resource we defined

// This is the main backend definition
const backend = defineBackend({
  api, // Include the api resource in the backend
});
