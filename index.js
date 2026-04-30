const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // استخدمنا الموديل الذي أكده الفحص الخاص بك
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("LOG ERROR:", error.message);
    res.status(500).json({ error: "فشل السيرفر في الرد", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is Live on port ${PORT}`));
