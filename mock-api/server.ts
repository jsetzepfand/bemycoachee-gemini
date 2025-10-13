import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000; // The port our mock server will run on

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The path to our JSON database file
const dbPath = path.resolve(__dirname, '../mock-chat-db.json');

app.use(express.json());
app.use(cors()); // Allow requests from the Vite dev server

// --- API Endpoints ---

// GET /api/messages - Fetches all messages
app.get('/api/messages', async (req, res) => {
  console.log('Mock API: Received request to GET /api/messages');
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const json = JSON.parse(data);
    res.json(json.messages);
  } catch (error) {
    console.error('Mock API Error:', error);
    res.status(500).send('Error reading from mock database');
  }
});

// POST /api/messages - Saves a user and coach message
app.post('/api/messages', async (req, res) => {
  console.log('Mock API: Received request to POST /api/messages');
  const { userMessage, coachMessage } = req.body;

  if (!userMessage || !coachMessage) {
    return res.status(400).send('Bad Request: userMessage and coachMessage are required.');
  }

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const json = JSON.parse(data);
    
    json.messages.push(userMessage, coachMessage);
    
    await fs.writeFile(dbPath, JSON.stringify(json, null, 2));
    
    res.status(201).send('Messages saved');
  } catch (error) {
    console.error('Mock API Error:', error);
    res.status(500).send('Error writing to mock database');
  }
});

app.listen(port, () => {
  console.log(`Mock API server listening on http://localhost:${port}`);
});
