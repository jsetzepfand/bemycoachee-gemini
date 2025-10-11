import { defineBackend } from "@aws-amplify/backend";
import { Stack, RemovalPolicy, Duration } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { HttpApi, HttpMethod, CorsHttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { messages } from "./functions/messages/resource";

const backend = defineBackend({ messages });

// --- DynamoDB table
const infra = backend.createStack("infra");
const table = new Table(infra, "ChatTable", {
  tableName: "bemycoachee-chat-messages",
  partitionKey: { name: "conversationId", type: AttributeType.STRING },
  sortKey: { name: "timestamp", type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.DESTROY, // change to RETAIN for prod
});

// Lambda permissions + env
backend.messages.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["dynamodb:Query", "dynamodb:PutItem", "dynamodb:BatchWriteItem", "dynamodb:UpdateItem", "dynamodb:GetItem", "dynamodb:DescribeTable"],
    resources: [table.tableArn, `${table.tableArn}/*`],
  })
);
backend.messages.resources.lambda.addEnvironment("TABLE_NAME", table.tableName);

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
const integration = new HttpLambdaIntegration("MessagesIntegration", backend.messages.resources.lambda);

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
