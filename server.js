require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

async function askGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + encodeURIComponent(key),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini API request failed.");
  }
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim() || "";
}

app.post("/api/process", async (req, res) => {
  const { text, targetLanguage } = req.body || {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Please enter an academic paragraph first." });
  }
  if (text.length > 12000) {
    return res.status(400).json({ error: "Please keep the paragraph under 12,000 characters." });
  }

  const language = targetLanguage || "Hindi";
  const prompt = `You are an educational language assistant. Process the academic text below.
Return ONLY valid JSON with these keys:
"translation": translate the full original text into ${language}, preserving meaning and technical terms accurately.
"simplified": rewrite the original in easy beginner-level English, preserving all important ideas.
"glossary": an array of at least five objects, each with "term" and "explanation", using technical terms actually relevant to the text.
"comparison": an object with "meaning", "accuracy", and "completeness", each a short honest comparison of outputs against the original. Do not claim perfect accuracy; recommend human review.
Original text:
${text}`;

  try {
    const result = await askGemini(prompt);
    if (result) {
      const cleaned = result.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      const parsed = JSON.parse(cleaned);
      return res.json({ ...parsed, mode: "AI", note: "Generated using Gemini AI. Review important translations before relying on them." });
    }
  } catch (error) {
    return res.status(502).json({ error: "AI processing failed: " + error.message + " Check your API key and try again." });
  }

  // Offline/demo fallback so the project can be demonstrated without an API key.
  // This is deliberately labelled as demo output rather than pretending to be live AI.
  const sentences = text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  const simplified = sentences.map(s => s
    .replace(/\butilize\b/gi, "use")
    .replace(/\bdemonstrate\b/gi, "show")
    .replace(/\bcommence\b/gi, "start")
    .replace(/\bapproximately\b/gi, "about")
    .replace(/\bsubsequently\b/gi, "later")
    .replace(/\bprior to\b/gi, "before")
    .replace(/\bin order to\b/gi, "to")
    .replace(/\b(therefore|thus)\b/gi, "so")
  ).join(" ");

  const terms = [
    ["Artificial Intelligence", "Technology that enables computers to perform tasks that usually need human intelligence."],
    ["Algorithm", "A set of steps used to solve a problem."],
    ["Data", "Facts or information that a computer can process."],
    ["Model", "A system trained or designed to recognize patterns or make predictions."],
    ["System", "A group of connected parts that work together."]
  ];

  return res.json({
    translation: `Demo mode is active. To generate a real ${language} translation, add a Gemini API key to your .env file and restart the server.\\n\\nOriginal text: ${text.trim()}`,
    simplified,
    glossary: terms,
    comparison: {
      meaning: "The demo simplifier keeps the original sentences and replaces a few complex words. Check that the main meaning is preserved.",
      accuracy: "This is rule-based demo output, not an AI-verified result. Review the text for errors.",
      completeness: "Most original content is retained, but the glossary is a generic example and may not match your paragraph."
    },
    mode: "DEMO",
    note: "Demo mode: add a Gemini API key for real translation, context-aware simplification, and a relevant glossary."
  });
});

app.listen(PORT, () => {
  console.log(`AI Language Translator & Text Simplifier running at http://localhost:${PORT}`);
});