// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sessionsRouter from "./routes/sessions.js";

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

// API routes
app.use("/api/sessions", sessionsRouter);
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Simple test route
app.get("/", (req, res) => {
  res.send("ParaTrain backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
