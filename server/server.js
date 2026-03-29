import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks,stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
const app = express();

// DB
await connectDB();
await connectCloudinary();

app.use(cors());

// ✅ Clerk middleware (IMPORTANT FIX)
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// ❌ DO NOT put express.json() before webhook
app.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ✅ JSON middleware
app.use(express.json());

// ✅ Logger
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("API working");
});

// Routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});