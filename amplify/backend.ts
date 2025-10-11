import { defineBackend } from "@aws-amplify/backend";
import { Stack, Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { HttpApi, HttpMethod, CorsHttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { messages } from "./functions/messages/resource";

const backend = defineBackend({ messages });

// --- Reuse existing DynamoDB table (do NOT create a new one)
const infra = backend.createStack("infra");
const existingName = "bemycoachee-chat-messages";
const tableArn = `arn:aws:dynamodb:${Stack.of(infra).region}:${Stack.of(infra).account}:table/${existingName}`;

const table = Table.fromTableAttributes(infra, "ChatTableImported", { tableArn });

// Grant Lambda R/W access and pass table name
table.grantReadWriteData(backend.messages.resources.lambda);
backend.messages.resources.lambda.addEnvironment("TABLE_NAME", existingName);

// --- HTTP API
const apiStack = backend.createStack("api");
const api = new HttpApi(apiStack, "HttpApi", {
  apiName: "messagesApi",
  corsPreflight: {
    allowMethods: [CorsHttpMethod.ANY],
    allowOrigins: ["*"],
    allowHeaders: ["*"],
    maxAge: Duration.days(1),
  },
});

const integration = new HttpLambdaIntegration(
  "MessagesIntegration",
  backend.messages.resources.lambda
);

// Routes
api.addRoutes({ path: "/messages", methods: [HttpMethod.GET, HttpMethod.POST], integration });

// --- Outputs for the frontend
backend.addOutput({
  custom: {
    API: {
      messagesApi: {
        endpoint: api.url,
        region: Stack.of(api).region,
        apiName: api.httpApiName,
      },
    },
  },
});

export default backend;
