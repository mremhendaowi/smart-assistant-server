const express = require('express');
const cors = require('cors'); // إضافة مكتبة CORS لحل مشكلة اتصال الموبايل
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // لقراءة مفتاح API من ملف .env محلياً أو من Render

const app = express();
const port = process.env.PORT || 10000;

// إعدادات السيرفر
app.use(cors()); // تفعيل CORS للسماح بالاتصال من تطبيق Flutter
app.use(express.json());

// إعداد الذكاء الاصطناعي Gemini
// تأكد من إضافة GEMINI_API_KEY في قسم Environment على منصة Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// تعريف الموديل مع تعليمات نظامية للرد بالعربية
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "أنت مساعد ذكي ومبرمج محترف تدعى المساعد الذكي، تم تطويرك من قبل المبرمج محمد الهنداوي. أجب دائماً باللغة العربية بأسلوب واضح ومفيد ومختصر."
});

// المسار الأساسي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send('سيرفر المساعد الذكي يعمل بنجاح!');
});

// مسار الشات الذي يتصل به تطبيق Flutter
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "الرسالة فارغة!" });
    }

    try {
        // إرسال الرسالة إلى Gemini وانتظار الرد
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // إرسال الرد إلى التطبيق
        res.json({ reply: text });
        console.log("تم إرسال الرد بنجاح.");
    } catch (error) {
        console.error("خطأ في معالجة طلب Gemini:", error);
        res.status(500).json({ 
            error: "حدث خطأ أثناء معالجة الطلب في السيرفر.",
            details: error.message 
        });
    }
});

// تشغيل السيرفر
app.listen(port, () => {
    console.log(`السيرفر يعمل الآن على الرابط: http://localhost:${port}`);
});
