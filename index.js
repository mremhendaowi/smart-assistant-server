const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;
app.post('/api/chat', async (req, res) => {
    try {
        console.log("جاري الاستعلام عن الموديلات المتاحة لمفتاحك...");
        
        // هذا الرابط سيعيد قائمة كل الموديلات التي يدعمها مفتاحك
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        
        const response = await fetch(listUrl);
        const data = await response.json();

        if (data.models) {
            console.log("✅ الموديلات المتاحة لك هي:");
            data.models.forEach(m => console.log("- " + m.name));
            
            // سنحاول الآن استخدام أول موديل يدعم generateContent من القائمة تلقائياً
            const supportedModel = data.models.find(m => m.supportedGenerationMethods.includes("generateContent"));
            
            if (supportedModel) {
                console.log(`🚀 محاولة الإرسال للموديل المتاح: ${supportedModel.name}`);
                const chatUrl = `https://generativelanguage.googleapis.com/v1beta/${supportedModel.name}:generateContent?key=${API_KEY}`;
                
                const chatRes = await fetch(chatUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: req.body.message }] }] })
                });
                
                const chatData = await chatRes.json();
                return res.json({ reply: chatData.candidates[0].content.parts[0].text });
            }
        }
        
        res.status(500).json({ reply: "لم نجد موديل يدعم توليد المحتوى في حسابك." });

    } catch (error) {
        console.error("فشل الاختبار:", error);
        res.status(500).json({ reply: "خطأ في الاتصال." });
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔍 سيرفر التشخيص يعمل على المنفذ ${PORT}`);
});