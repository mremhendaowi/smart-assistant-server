const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// تأكد من وضع مفتاح API الخاص بك في ملف .env أو في إعدادات Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "الرجاء إرسال رسالة" });
  }

  try {
    // استخدام gemini-1.5-flash كونه الأكثر استقراراً ودعماً حالياً
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error details:", error);
    
    // رسالة خطأ مفصلة للمساعدة في التتبع
    res.status(500).json({ 
      reply: "حدث خطأ في معالجة الطلب",
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
