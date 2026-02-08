// server.js
// -------------------- LOAD ENV --------------------
import 'dotenv/config'; // ✅ Must be at the very top for ESM

// -------------------- IMPORTS --------------------
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";

// -------------------- APP SETUP --------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "20mb" })); // Increase limit if HTML is large

// -------------------- SUPABASE SETUP --------------------
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_URL or SUPABASE_SERVICE_KEY not set in .env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// -------------------- AI REPORT --------------------
app.post("/api/ai-report", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // 1️⃣ Fetch latest hand accuracy data
    const { data: handData, error: handError } = await supabase
      .from("hand_accuracy")
      .select("peace_avg, paper_avg, rock_avg, overall_avg")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (handError) {
      console.warn("⚠️ Failed to fetch hand accuracy:", handError.message);
    }

    const handInfo = handData
      ? `\n\nHand Accuracy:\n- Peace: ${handData.peace_avg}%\n- Paper: ${handData.paper_avg}%\n- Rock: ${handData.rock_avg}%\n- Overall: ${handData.overall_avg}%\n`
      : "\n\n⚠️ No hand accuracy data available.\n";

    // 2️⃣ Build AI prompt
    const fullPrompt = `
You are a medical assistant. Provide the output in exactly two sections for a simulation of hands matching poses with accuracy and inaccuracy of fingers:

### Test Results (2–3 short bullet points only)
### Suggestions for Improvement (2–3 short bullet points only)

Hand accuracy data (latest session):
${handInfo}

Be precise. Do not include patient info. Focus on simulation results and physiotherapy/diet suggestions.

---
${prompt}
    `;

    // 3️⃣ Call AI API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: fullPrompt,
        stream: false,
      }),
    });

    const data = await response.json();
    const content = data.response || "⚠️ No response from AI";

    // 4️⃣ Split AI output into sections
    let testResults = "";
    let suggestions = "";

    if (content.includes("### Test Results")) {
      const parts = content.split("### Suggestions for Improvement");
      testResults = parts[0].replace("### Test Results", "").trim();
      suggestions = parts[1]?.trim() || "";
    } else {
      testResults = content;
    }

    res.json({ testResults, suggestions });
  } catch (err) {
    console.error("❌ AI fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

// -------------------- LAST USER DATA --------------------
app.get("/api/patient", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, phone")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

// -------------------- SENSOR METADATA --------------------
app.get("/api/sensor-metadata", async (req, res) => {
  try {
    const { data: sensorData, error } = await supabase
      .from("sensor_metadata")
      .select("id, left_hit, right_hit, accuracy, session_id")
      .order("id", { ascending: true })
      .limit(2);

    if (error) throw error;
    res.json(sensorData || []);
  } catch (err) {
    console.error("❌ Error fetching sensor metadata:", err);
    res.status(500).json({ error: "Failed to fetch sensor metadata" });
  }
});

// -------------------- UPLOAD HTML PDF --------------------
app.post("/api/upload-html-pdf", async (req, res) => {
  try {
    const { htmlContent, patientId } = req.body;

    if (!htmlContent || !patientId) {
      return res.status(400).json({ success: false, error: "Missing HTML content or patientId" });
    }

    // 1️⃣ Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // 2️⃣ Upload PDF to Supabase
    const filename = `report_${patientId}_${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(filename, pdfBuffer, { contentType: "application/pdf", upsert: true });

    if (uploadError) throw uploadError;

    // 3️⃣ Get public URL
    const pdfUrl = supabase.storage.from("reports").getPublicUrl(filename).publicUrl;

    // 4️⃣ Save metadata in reports_table
    const { error: dbError } = await supabase
      .from("reports_table")
      .insert({ patient_id: patientId, pdf_url: pdfUrl });

    if (dbError) console.warn("⚠️ Failed to insert metadata:", dbError.message);

    res.json({ success: true, pdfUrl });
  } catch (err) {
    console.error("❌ PDF upload error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
