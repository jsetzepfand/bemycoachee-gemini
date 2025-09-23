const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory store for chat messages
const messages = [
  {
    text: 'Hello! I am your AI Coach. How can I help you today?',
    sender: 'coach',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

// GET endpoint to retrieve all messages
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// POST endpoint to add a new message
app.post('/api/messages', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const userMessage = {
    text,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  messages.push(userMessage);

  // Simulate a coach's reply
  const coachReply = {
    text: `Thank you for sharing. I hear you saying: "${text}". Let's explore that further.`,
    sender: 'coach',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  // Add the coach's reply after a short delay to feel more natural
  setTimeout(() => {
      messages.push(coachReply);
  }, 1000);

  // Respond immediately with the user's message
  res.status(201).json(userMessage);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
