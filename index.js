const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors'); // مهم جداً للاتصال من الموبايل
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors()); // السماح بالوصول من أي مصدر
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// صفحة ترحيبية بدلاً من "Cannot GET /"
app.get('/', (req, res) => {
  res.send("السيرفر يعمل بنجاح! جاهز لاستقبال رسائل الدردشة على المسار /chat");
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "الرسالة فارغة!" });

  try {
    // استخدمنا الإصدار الأحدث gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "خطأ داخلي في السيرفر", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
