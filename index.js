const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!API_KEY) {
    return res.json({
      reply: "مفتاح Gemini غير موجود"
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.error) {
      return res.json({
        reply: "خطأ: " + data.error.message
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "لا يوجد رد";

    res.json({ reply });

  } catch (error) {
    res.json({
      reply: "خطأ في الاتصال"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on " + PORT);
});
