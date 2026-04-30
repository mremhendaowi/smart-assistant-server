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
    // إجبار المكتبة على استخدام v1 بدلاً من v1beta لمنع خطأ الـ 404
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: 'v1' } 
    );

    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });

  } catch (error) {
    console.error("LOG ERROR:", error.message);
    res.status(500).json({ reply: "حدث خطأ في النظام", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
