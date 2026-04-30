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
    // التغيير هنا: تحديد v1 يدوياً وتغيير اسم الموديل ليكون أكثر دقة
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash-latest" }, // إضافة -latest تضمن الوصول لأحدث نسخة مستقرة
      { apiVersion: 'v1' } // إجبار المكتبة على ترك v1beta والتحويل لـ v1
    );

    const result = await model.generateContent(message);
    const text = result.response.text();
    res.json({ reply: text });

  } catch (error) {
    console.error("LOG ERROR:", error.message);
    res.status(500).json({ error: "فشل في معالجة الموديل", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
