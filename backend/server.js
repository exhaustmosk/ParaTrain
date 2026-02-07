import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// -------------------- SUPABASE CLIENTS --------------------

// 🔐 Admin client (for signup)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 👤 Public client (for login + session)
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// -------------------- AUTH ROUTES --------------------

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      success: true,
      user: data.user
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    success: true,
    session: data.session,
    user: data.user
  });
});

// -------------------- SESSION CHECK --------------------
app.get("/api/session", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.json({ user: data.user });
});

// -------------------- HEALTH CHECK --------------------
app.get("/", (req, res) => {
  res.send("🚀 ParaTrain Backend Running");
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
