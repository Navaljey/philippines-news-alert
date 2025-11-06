import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// 🔹 번역 API 엔드포인트
app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: "Missing 'text' in request body" });
    }

    // ✅ OpenAI API나 Papago 등 원하는 번역 엔진 사용 가능
    // 예시: OpenAI GPT 기반 번역
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Translate English text into natural Korean." },
        { role: "user", content: text }
      ],
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      }
    });

    const translated = response.data.choices[0].message.content;

    res.json({ success: true, original: text, translated });
  } catch (err) {
    console.error("Translation error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Translation API running on port 3000"));
