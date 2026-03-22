import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

// 👉 REPLACE ONLY THIS PART
app.post("/clerk", (req, res) => {
  console.log("CLERK HIT ✅");
  res.status(200).json({ success: true });
});

// existing route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

export default app;