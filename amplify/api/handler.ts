import express, { Request, Response } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

// --- Express App Setup ---
const app = express();
app.use(express.json());

// --- DynamoDB Configuration ---
const region = process.env.AWS_REGION || 'eu-central-1';
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const CHAT_TABLE_NAME = 'bemycoachee-chat-messages'; // The name of your manually created table
const CONVERSATION_ID = 'default-conversation';

// --- API Endpoints ---

// GET /messages - Retrieves all messages
app.get('/messages', async (req: Request, res: Response) => {
  const params = {
    TableName: CHAT_TABLE_NAME,
    KeyConditionExpression: 'conversationId = :convId',
    ExpressionAttributeValues: { ':convId': CONVERSATION_ID },
    ScanIndexForward: true,
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    res.json(data.Items || []);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

// POST /messages - Adds a new message and a coach reply
app.post('/messages', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const userMessage = {
    conversationId: CONVERSATION_ID,
    timestamp: new Date().toISOString(),
    sender: 'user',
    text: text.trim(),
  };

  const coachReply = {
    conversationId: CONVERSATION_ID,
    timestamp: new Date(new Date().getTime() + 1000).toISOString(),
    sender: 'coach',
    text: `Thank you for sharing. I hear you saying: "${text.trim()}". Let\'s explore that further.`,
  };

  try {
    await ddbDocClient.send(new PutCommand({ TableName: CHAT_TABLE_NAME, Item: userMessage }));
    await ddbDocClient.send(new PutCommand({ TableName: CHAT_TABLE_NAME, Item: coachReply }));
    res.status(201).json(userMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: 'Could not save message' });
  }
});

// This is the standard handler export for an Express app in Amplify Gen 2
export const handler = app;
