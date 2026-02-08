import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// ---------------- OTP STORE ----------------
const otpStore = new Map(); // email -> { otp, expires }

// ---------------- MAILER (same as working reference project) ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const DOCTOR_EMAIL = "123";
const DOCTOR_PASSWORD = "123";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ---------------- SEND OTP ----------------
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  console.log("[OTP] Request received for email:", email || "(missing)");

  if (!email) return res.status(400).json({ error: "Email required" });

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    return res.status(500).json({
      error: "Email not configured. Set EMAIL_USER and EMAIL_PASS in .env.",
      debug: { emailUserSet: !!emailUser, emailPassSet: !!emailPass },
    });
  }

  const otp = generateOTP();
  otpStore.set(email, {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 min
  });

  try {
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: "Your OTP for ParaTrain",
      text: `Hello,\n\nYour One-Time Password (OTP) is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.\n\n— ParaTrain Team`,
    });
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    const reason = err.message || String(err);
    const code = err.code || "";
    console.error("[OTP] Send failed:", reason, code ? `[${code}]` : "");
    res.status(500).json({
      error: "Failed to send OTP",
      debug: {
        reason,
        hint:
          code === "EAUTH"
            ? "Wrong email or app password. Use a Gmail App Password."
            : code === "ESOCKET" || code === "ETIMEDOUT"
              ? "Network/firewall blocked."
              : "Check .env (EMAIL_USER, EMAIL_PASS).",
      },
    });
  }
});

// ---------------- VERIFY OTP + CREATE PATIENT (frontend calls this) ----------------
router.post("/verify-otp", async (req, res) => {
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

  return res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "patient" },
  });
});

// ---------------- SIGNUP (alias; frontend uses verify-otp) ----------------
router.post("/signup", async (req, res) => {
  const { name, email, phone, password, otp } = req.body;
  if (!name || !email || !phone || !password || !otp) {
    return res.status(400).json({ error: "All fields required" });
  }
  const record = otpStore.get(email);
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const { data: newUser, error } = await supabase
    .from("users")
    .insert([{ name, email, phone, password: hashedPassword }])
    .select("id, name, email")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  otpStore.delete(email);
  res.json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: "patient" },
  });
});

// ---------------- LOGIN (doctor 123/123 or patient from users table) ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

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

export default router;
