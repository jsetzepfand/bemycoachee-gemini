const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// The AWS region can be configured via environment variables or will default if not set.
const region = process.env.AWS_REGION || "eu-central-1"; // Default to a common region

// Create the DynamoDB client.
// The SDK will automatically and securely use credentials from the environment.
// No hardcoded keys are needed.
const ddbClient = new DynamoDBClient({ region });

// Create the Document Client, which simplifies working with DynamoDB items.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

module.exports = { ddbDocClient };
