import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

await connectDB();

app.use(cors());

// ⚠️ IMPORTANT: use raw body for webhook
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

export default app;