import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

await connectDB();

app.use(cors());

// ❌ DO NOT use express.json() globally

app.get('/', (req, res) => {
  res.send('API is working');
});

// ✅ RAW body ONLY for webhook
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

export default app;