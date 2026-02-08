// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import sessionsRouter from "./routes/sessions.js";
import authRouter from "./routes/auth.js";
import { supabase } from "./supabaseClient.js";

// Load .env from backend/ or project root (so EMAIL_USER, EMAIL_PASS work when run from backend/)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

const DOCTOR_EMAIL = "123";

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- MIDDLEWARE -----------------
// Allow all origins (including Electron) so frontend can reach the API
app.use(
  cors({
    origin: (_, cb) => cb(null, true),
    credentials: true,
  })
);
app.use(express.json());

// ----------------- ROUTES -----------------
app.use("/api/sessions", sessionsRouter);
app.use("/api/auth", authRouter);

// Session check (same shape as server.js for frontend compatibility)
app.get("/api/session", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });
  if (token === "doctor") {
    return res.json({
      user: { id: "doctor", email: DOCTOR_EMAIL, name: "Doctor", role: "doctor" },
    });
  }
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("id", token)
    .maybeSingle();
  if (error || !data) return res.status(401).json({ error: "Invalid token" });
  res.json({ user: { ...data, role: "patient" } });
});

// Simple test route
app.get("/", (req, res) => {
  res.send("ParaTrain backend is running!");
});

// ----------------- START SERVER -----------------
// Bind to 0.0.0.0 so requests from 127.0.0.1 (Electron/frontend) are accepted
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT} (and http://127.0.0.1:${PORT})`);
  console.log("[OTP] EMAIL_USER:", process.env.EMAIL_USER ? "set" : "NOT SET");
  console.log("[OTP] EMAIL_PASS:", process.env.EMAIL_PASS ? "set" : "NOT SET");
});
