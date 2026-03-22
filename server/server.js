import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// DB
await connectDB();

app.use(cors());

// ❌ DO NOT put express.json() here

// ✅ WEBHOOK FIRST (RAW BODY)
app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// ✅ NOW you can use JSON for other routes
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});