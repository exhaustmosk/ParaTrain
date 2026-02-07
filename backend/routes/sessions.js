// backend/routes/sessions.js
import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Get all sessions for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Create a new session
router.post("/", async (req, res) => {
  const { user_id, simulation_type, duration, score } = req.body;

  const { data, error } = await supabase
    .from("sessions")
    .insert([{ user_id, simulation_type, duration, score }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
