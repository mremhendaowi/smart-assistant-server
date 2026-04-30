import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.OPENROUTER_API_KEY;

// ✅ اختبار السيرفر
app.get("/", (req, res) => {
  res.send("Server is working");
});

// ✅ جلب الموديلات
app.get("/models", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      error: "المفتاح غير موجود في السيرفر"
    });
  }

  res.json({
    status: "success",
    models: ["mistralai/mistral-7b-instruct"]
  });
});

// ✅ المسار الأساسي للتطبيق (مهم)
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!API_KEY) {
    return res.json({
      reply: "المفتاح غير موجود في السيرفر"
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenRouter:", data);

    if (data.error) {
      return res.json({
        reply: "خطأ: " + data.error.message
      });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "لا يوجد رد";

    res.json({ reply });

  } catch (error) {
    console.log("Server error:", error);
    res.json({
      reply: "خطأ في الاتصال بالسيرفر"
    });
  }
});

// ✅ تشغيل السيرفر
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
