import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiAvailable: Boolean(process.env.GEMINI_API_KEY) });
});

// 1. AI Weak-Key Remediation Drill Generator
app.post("/api/ai/weak-key-drill", async (req, res) => {
  try {
    const { weakKeys, difficulty = 'medium', language = 'mr' } = req.body;

    if (!Array.isArray(weakKeys) || weakKeys.length === 0) {
      return res.status(400).json({ error: "Weak keys array is required" });
    }

    const ai = getAI();
    const charsList = weakKeys.slice(0, 8).join(', ');

    if (ai) {
      const prompt = `You are an expert Marathi typing instructor for GCC-TBC certification using the ISM Remington keyboard.
Generate a targeted typing practice exercise specifically focusing on these weak characters/letters: [${charsList}].
Difficulty: ${difficulty}.
Requirements:
1. Provide 6 to 8 short, meaningful, grammatically correct Marathi sentences and words containing high density of the target characters [${charsList}].
2. The language must be authentic, fluent Marathi (शुद्ध मराठी).
3. Do not include English words or explanations in the final practice text.
4. Output JSON in the following exact format:
{
  "titleMr": "विशेष AI अक्षर सराव (${charsList})",
  "titleEn": "AI Targeted Weak-Key Drill (${charsList})",
  "descriptionMr": "तुमच्या कमजोर अक्षरांवर (${charsList}) आधारित विशेष AI सराव संच.",
  "descriptionEn": "Custom AI-generated drill targeting error-prone keys: ${charsList}.",
  "sentences": ["वाक्य १...", "वाक्य २...", "वाक्य ३..."],
  "targetText": "पूर्ण सराव मजकूर एकाच पॅसेजमध्ये..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, data: parsed });
        } catch {
          // fallback if parse fails
        }
      }
    }

    // High quality offline fallback generator if AI key is unavailable or fails
    const sampleSentences: Record<string, string[]> = {
      'default': [
        `अचूक आणि जलद टंकलेखनासाठी रोज नियमित सराव करणे अत्यंत आवश्यक आहे.`,
        `मराठी भाषा ही अतिशय समृद्ध आणि ज्ञानभाषा म्हणून ओळखली जाते.`,
        `प्रयत्न आणि सातत्य या दोन गोष्टींमुळे कोणतीही कला आत्मसात करता येते.`
      ]
    };

    const combinedFallback = weakKeys.map(k => `सराव ${k} अचूक ${k} गती ${k} शब्द ${k}`).join(' । ') + ' । ' + sampleSentences.default.join(' ');

    return res.json({
      success: true,
      data: {
        titleMr: `विशेष AI अक्षर सराव (${charsList})`,
        titleEn: `AI Targeted Weak-Key Drill (${charsList})`,
        descriptionMr: `वारंवार चुकणाऱ्या अक्षरांचा (${charsList}) जलद सुधारणा संच.`,
        descriptionEn: `Targeted remediation drill for ${charsList}.`,
        sentences: sampleSentences.default,
        targetText: combinedFallback
      }
    });
  } catch (error: unknown) {
    console.error("AI weak drill generation error:", error);
    const message = error instanceof Error ? error.message : "Generation failed";
    res.status(500).json({ error: message });
  }
});

// 2. AI Marathi Passage Generator by Domain / Topic
app.post("/api/ai/generate-passage", async (req, res) => {
  try {
    const { topic, difficulty = 'medium', speedTarget = 30 } = req.body;

    const topicMap: Record<string, string> = {
      'admin': 'महाराष्ट्र शासन परिपत्रके, कार्यालयीन कामकाज, ई-प्रशासन व लोकसेवा',
      'history': 'छत्रपती शिवाजी महाराज, स्वराज्याची स्थापना, किल्ले व संतांचे विचार',
      'science': 'माहिती तंत्रज्ञान, कृत्रिम बुद्धिमत्ता, अवकाश संशोधन व विज्ञान प्रगती',
      'agriculture': 'महाराष्ट्र कृषी, शेतकरी समृद्धी, जलसंधारण व ग्रामीण जीवन',
      'literature': 'मराठी भाषा गौरव, साहित्य संमेलन, काव्य व नाटक परंपरा',
      'law': 'भारतीय संविधान, लोकशाही मूल्ये, विधी व न्यायव्यवस्था'
    };

    const selectedTopicDescription = topicMap[topic] || topic || 'सामान्य ज्ञान व सामाजिक प्रबोधन';
    const wordCount = speedTarget === 40 ? 150 : 100;

    const ai = getAI();
    if (ai) {
      const prompt = `You are a certified Marathi typing passage examiner creating realistic GCC-TBC / MPSC Marathi typing exam paragraphs.
Topic: ${selectedTopicDescription}.
Target Speed: ${speedTarget} WPM.
Difficulty: ${difficulty}.
Approximate Word Count: ${wordCount} words (around 500-800 characters).

Requirements:
1. Write a clean, coherent, formal, grammatically impeccable Marathi passage suitable for Maharashtra state typing examination.
2. Use standard Devanagari punctuation (full stops, commas).
3. Do not include transliterations or English text.
4. Output JSON in this exact structure:
{
  "titleMr": "परिच्छेद शीर्षक",
  "titleEn": "Passage Title in English",
  "category": "${topic}",
  "level": "${difficulty}",
  "text": "मराठी परिच्छेद मजकूर..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.75,
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, data: parsed });
        } catch {
          // fallback
        }
      }
    }

    // Offline fallback for passage
    const fallbackText = `महाराष्ट्र शासनाच्या विविध विभागांमध्ये संगणकीय टंकलेखन ही एक अत्यंत आवश्यक व मूलभूत कार्यप्रणाली बनली आहे. ई-प्रशासनाच्या माध्यमातून सर्वसामान्य नागरिकांना विविध शासकीय योजनांचा लाभ वेळेत मिळवून देण्यासाठी आधुनिक तंत्रज्ञानाचा प्रभावी वापर केला जात आहे. गतिमान आणि पारदर्शक कारभारासाठी शासकीय अधिकारी व कर्मचाऱ्यांना योग्य टंकलेखन कौशल्य असणे गरजेचे आहे.`;

    return res.json({
      success: true,
      data: {
        titleMr: `शासकीय ई-प्रशासन व पारदर्शक कारभार`,
        titleEn: `Government E-Governance & Transparency`,
        category: topic || 'admin',
        level: difficulty,
        text: fallbackText
      }
    });
  } catch (error: unknown) {
    console.error("AI passage generation error:", error);
    const message = error instanceof Error ? error.message : "Passage generation failed";
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Marathi Typing Master Server running on port ${PORT}`);
  });
}

startServer();
