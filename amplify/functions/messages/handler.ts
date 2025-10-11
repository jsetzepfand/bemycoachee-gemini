import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION || "eu-central-1";
const tableName = process.env.TABLE_NAME!;
const conversationId = "default-conversation";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const path = event.rawPath || "/";
    const method = (event.requestContext.http.method || "GET").toUpperCase();

    if (path.startsWith("/messages") && method === "GET") {
      const resp = await ddb.send(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "conversationId = :id",
        ExpressionAttributeValues: { ":id": conversationId },
        ScanIndexForward: true,
      }));
      return json(200, resp.Items ?? []);
    }

    if (path.startsWith("/messages") && method === "POST") {
      const body = event.body ? JSON.parse(event.body) : {};
      const text = typeof body.text === "string" ? body.text.trim() : "";
      if (!text) return json(400, { error: "Message text is required" });

      const now = new Date();
      const userMsg = { conversationId, timestamp: now.toISOString(), sender: "user", text };
      const coachMsg = {
        conversationId,
        timestamp: new Date(now.getTime() + 1000).toISOString(),
        sender: "coach",
        text: `Thanks for sharing. I hear you saying: "${text}".`,
      };
      await ddb.send(new PutCommand({ TableName: tableName, Item: userMsg }));
      await ddb.send(new PutCommand({ TableName: tableName, Item: coachMsg }));
      return json(201, userMsg);
    }

    return json(404, { error: "Route not found" });
  } catch (e) {
    console.error(e);
    return json(500, { error: "Unexpected error" });
  }
};

const json = (statusCode: number, data: any) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  },
  body: JSON.stringify(data),
});
