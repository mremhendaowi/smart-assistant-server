const express = require('express');
const app = express();

// 1. قراءة المنفذ من نظام Render أو استخدام 10000 كافتراضي محلياً
const PORT = process.env.PORT || 10000;

app.use(express.json());

// مثال لنقطة النهاية التي يستعلم عنها تطبيق فلاتر
app.get('/models', async (req, res) => {
    try {
        // تأكد من إضافة API_KEY في إعدادات Render
        const apiKey = process.env.API_KEY;
        
        if (!apiKey) {
            console.error("خطأ: API_KEY غير معرف في إعدادات Render");
            return res.status(500).json({ error: "المفتاح غير موجود على السيرفر" });
        }

        // هنا تضع منطق جلب الموديلات (مثلاً من Google أو OpenAI)
        // سأرسل قائمة تجريبية للتأكد من نجاح الاتصال
        res.json({
            status: "success",
            models: ["gemini-1.5-flash", "gemini-1.5-pro"]
        });
        
    } catch (error) {
        console.error("Internal Error:", error);
        res.status(500).json({ error: "فشل في جلب الموديلات" });
    }
});

// 2. الربط (Binding) على 0.0.0.0 ضروري جداً لـ Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
