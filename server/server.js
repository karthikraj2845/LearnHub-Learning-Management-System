import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

// DB
await connectDB();

// Middlewares
app.use(cors());

// ❗ Normal JSON routes (if any)
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API working');
});

// ✅ Webhook route (RAW BODY ONLY)
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});