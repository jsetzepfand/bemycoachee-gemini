const express = require('express');
const cors = require('cors');
const { ddbDocClient } = require('./db');
const { QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- DynamoDB Configuration ---
// It's a best practice to use environment variables for table names.
const CHAT_TABLE_NAME = process.env.CHAT_TABLE_NAME || 'bemycoachee-chat-messages';

// For simplicity in this single-user demo, we'll use a fixed conversation ID.
// In a real multi-user app, this would be dynamic (e.g., based on the logged-in user).
const CONVERSATION_ID = 'default-conversation';

// --- API Endpoints ---/

// GET endpoint to retrieve all messages for the conversation
app.get('/api/messages', async (req, res) => {
  const params = {
    TableName: CHAT_TABLE_NAME,
    KeyConditionExpression: 'conversationId = :convId',
    ExpressionAttributeValues: {
      ':convId': CONVERSATION_ID,
    },
    // Ensures messages are returned in the order they were created
    ScanIndexForward: true, // true for ascending, false for descending
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    res.json(data.Items || []);
  } catch (err) {
    console.error("Error fetching messages from DynamoDB:", err);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
});

// POST endpoint to add a new message
app.post('/api/messages', async (req, res) => {
  const { text } = req.body;

  // Security: Basic input validation. Ensure we only process expected data.
  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Message text is required and must be a non-empty string' });
  }

  const userMessage = {
    conversationId: CONVERSATION_ID,
    timestamp: new Date().toISOString(), // Use ISO 8601 for sortable timestamps
    sender: 'user',
    text: text.trim(), // Security: Trim whitespace
  };

  const coachReply = {
    conversationId: CONVERSATION_ID,
    timestamp: new Date(new Date().getTime() + 1000).toISOString(), // Ensure coach reply is always after
    sender: 'coach',
    text: `Thank you for sharing. I hear you saying: "${text.trim()}". Let's explore that further.`,
  };

  try {
    // Save the user's message to DynamoDB
    await ddbDocClient.send(new PutCommand({ TableName: CHAT_TABLE_NAME, Item: userMessage }));
    
    // Save the coach's reply to DynamoDB
    await ddbDocClient.send(new PutCommand({ TableName: CHAT_TABLE_NAME, Item: coachReply }));

    // Respond with the message that was created on behalf of the user
    res.status(201).json(userMessage);

  } catch (err) {
    console.error("Error saving message to DynamoDB:", err);
    res.status(500).json({ error: 'Could not save message' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
