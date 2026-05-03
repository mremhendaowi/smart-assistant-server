const express = require('express');
const cors = require('cors'); // مكتبة السماح بالاتصال من الموبايل
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // لقراءة مفتاح API من Environment Variables

const app = express();
const port = process.env.PORT || 10000;

// --- الإعدادات الهامة (Middlewares) ---

// 1. تفعيل استقبال بيانات JSON (ضروري جداً ليفهم السيرفر رسالة التطبيق)
app.use(express.json()); 

// 2. تفعيل CORS بأقصى صلاحيات لضمان عدم حظر هاتف Redmi
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// --- إعداد الذكاء الاصطناعي Gemini ---

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// إعداد الموديل مع الهوية البرمجية الخاصة بك
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "أنت مساعد ذكي ومبرمج محترف تدعى المساعد الذكي، تم تطويرك من قبل المبرمج محمد الهنداوي. أجب دائماً باللغة العربية بأسلوب واضح ومفيد ومختصر."
});

// --- المسارات (Routes) ---

// مسار فحص السيرفر (يظهر عند فتح الرابط في المتصفح)
app.get('/', (req, res) => {
    res.send('سيرفر المساعد الذكي يعمل بنجاح! جاهز لاستقبال رسائل تطبيق شام واتس.');
});

// المسار الرئيسي لاستقبال المحادثات من Flutter
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    // التحقق من وصول الرسالة
    if (!message) {
        return res.status(400).json({ error: "الرسالة فارغة أو غير موجودة في الطلب!" });
    }

    try {
        // إرسال النص إلى Gemini
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // إرجاع الرد بتنسيق JSON يفهمه التطبيق
        res.json({ reply: text });
        console.log("تمت معالجة الرسالة وإرسال الرد بنجاح.");
    } catch (error) {
        console.error("خطأ في الاتصال بـ Gemini:", error);
        res.status(500).json({ 
            error: "حدث خطأ في السيرفر أثناء معالجة الرد.",
            details: error.message 
        });
    }
});

// تشغيل السيرفر
app.listen(port, () => {
    console.log(`السيرفر يعمل الآن ومستعد على المنفذ: ${port}`);
});
