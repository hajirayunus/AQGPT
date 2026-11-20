import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "AQGPT needs an OpenAI API key. Add OPENAI_API_KEY to your .env file and restart the server." });
    }
    const { messages = [] } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Please send a message." });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are AQGPT, a helpful, thoughtful, friendly AI assistant. Give clear, accurate answers. Be honest about uncertainty and never claim to be ChatGPT or an OpenAI product." },
        ...messages.slice(-30).map(({ role, content }) => ({
          role: role === "assistant" ? "assistant" : "user",
          content: String(content).slice(0, 12000)
        }))
      ]
    });
    res.json({ reply: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again." });
  } catch (error) {
    console.error("AQGPT API error:", error?.message || error);
    res.status(error?.status || 500).json({ error: error?.status === 401 ? "The API key was not accepted. Check OPENAI_API_KEY in your .env file." : "AQGPT couldn't reach the AI service. Please try again." });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`AQGPT API running at http://localhost:${port}`));