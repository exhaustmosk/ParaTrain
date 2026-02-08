import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// Load .env same way as your working project (current dir + project root)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
// Allow all origins (including Electron's null/file origin) so frontend can reach the API
app.use(
  cors({
    origin: (_, cb) => cb(null, true),
    credentials: true,
  })
);
app.use(express.json());

// -------------------- SUPABASE (users table) --------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -------------------- HARDCODED DOCTOR --------------------
const DOCTOR_EMAIL = "123";
const DOCTOR_PASSWORD = "123";

// -------------------- OTP CONFIG (same as your working reference) --------------------
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const otpStore = new Map(); // email -> { otp, expires }

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function getEmailErrorReason(err) {
  if (!err) return "Unknown error";
  const msg = err.message || String(err);
  const code = err.code || "";
  const response = err.response || "";
  const responseCode = err.responseCode || "";
  let reason = msg;
  if (code) reason += ` [code: ${code}]`;
  if (responseCode) reason += ` [SMTP: ${responseCode}]`;
  if (response && typeof response === "string") reason += ` [${response.slice(0, 200)}]`;
  if (err.command) reason += ` [command: ${err.command}]`;
  return reason;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for ParaTrain",
    text: `Hello,\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.\n\n— ParaTrain Team`,
  });
}

// -------------------- AUTH ROUTES --------------------

// STEP 1: SEND OTP (for patient signup)
app.post("/api/auth/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email required" });

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    console.error("[OTP] .env not loaded. EMAIL_USER:", !!emailUser, "EMAIL_PASS:", !!emailPass, "cwd:", process.cwd());
    return res.status(500).json({
      error: "Email not configured. Set EMAIL_USER and EMAIL_PASS in .env (in project root or backend folder).",
      debug: { cwd: process.cwd(), emailUserSet: !!emailUser, emailPassSet: !!emailPass },
    });
  }

  const otp = generateOtp();
  otpStore.set(email, { otp, expires: Date.now() + OTP_EXPIRY_MS });

  try {
    await sendOtpEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    const reason = getEmailErrorReason(err);
    console.error("[OTP] Send failed:", reason);
    console.error("[OTP] Full error:", err);
    res.status(500).json({
      error: "Failed to send OTP",
      debug: {
        reason,
        hint:
          err.code === "EAUTH"
            ? "Wrong email or app password. Use a Gmail App Password (not your normal password)."
            : err.code === "ESOCKET" || err.code === "ETIMEDOUT"
              ? "Network/firewall blocked. Check internet or try another network."
              : "Check server logs and .env (EMAIL_USER, EMAIL_PASS).",
      },
    });
  }
});

// STEP 2: VERIFY OTP + CREATE PATIENT IN users TABLE
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp, name, phone, password } = req.body;

  if (!email || !otp || !name || !phone || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  const record = otpStore.get(email);
  if (!record || record.otp !== otp) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }
  if (record.expires < Date.now()) {
    otpStore.delete(email);
    return res.status(401).json({ error: "OTP expired. Please request a new one." });
  }

  otpStore.delete(email);

  try {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name, email, phone, password: hashedPassword }])
      .select("id, name, email")
      .single();

    if (error) {
      console.error("User insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "patient" },
    });
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN: doctor (123/123) or patient from users table
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  // Hardcoded doctor account
  if (email === DOCTOR_EMAIL && password === DOCTOR_PASSWORD) {
    return res.json({
      success: true,
      session: { access_token: "doctor", role: "doctor" },
      user: {
        id: "doctor",
        email: DOCTOR_EMAIL,
        name: "Doctor",
        role: "doctor",
      },
    });
  }

  // Patient: lookup in users table
  const { data: users, error: fetchError } = await supabase
    .from("users")
    .select("id, name, email, password")
    .eq("email", email)
    .limit(1);

  if (fetchError || !users?.length) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({
    success: true,
    session: { access_token: user.id, role: "patient" },
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "patient",
    },
  });
});

// SESSION CHECK (optional: validate token for protected routes)
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

// -------------------- HEALTH CHECK --------------------
app.get("/", (req, res) => {
  res.send("🚀 ParaTrain Backend Running");
});

// -------------------- START SERVER --------------------
// Bind to 0.0.0.0 so requests from 127.0.0.1 (Electron/frontend) are accepted
app.listen(PORT, "0.0.0.0", async () => {
  const eu = process.env.EMAIL_USER;
  const ep = process.env.EMAIL_PASS;
  console.log(`🔥 Server running on http://localhost:${PORT}`);
  console.log("[OTP] EMAIL_USER:", eu ? `${eu.slice(0, 3)}***` : "NOT SET");
  console.log("[OTP] EMAIL_PASS:", ep ? "***set***" : "NOT SET");
  console.log("[OTP] cwd:", process.cwd());
  if (eu && ep) {
    try {
      await transporter.verify();
      console.log("[OTP] SMTP connection verified OK");
    } catch (err) {
      console.error("[OTP] SMTP verify FAILED:", getEmailErrorReason(err));
    }
  }
});
