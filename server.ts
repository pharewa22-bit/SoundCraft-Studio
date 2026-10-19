import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI SDK if key available
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API Endpoint: AI Radio Assistant - Analyze Broadcast Script
  app.post('/api/ai-review', async (req, res) => {
    try {
      const { scriptText, scriptType = 'spot_30s', targetSeconds = 30 } = req.body;

      if (!scriptText || typeof scriptText !== 'string' || scriptText.trim().length === 0) {
        return res.status(400).json({ error: 'กรุณาระบุข้อความบทวิทยุที่ต้องการตรวจทาน' });
      }

      // Compute core metrics
      const words = scriptText.trim().split(/\s+/).filter(Boolean);
      const wordCount = words.length;
      const thaiChars = scriptText.replace(/[^ก-๙]/g, '').length;
      const estimatedSyllables = Math.max(1, Math.round(thaiChars / 2.6) + wordCount);
      const estimatedSeconds = Math.max(5, Math.round(estimatedSyllables / 3.8));

      // Check sound technique commands
      const lower = scriptText.toLowerCase();
      const hasFI = lower.includes('fade in') || lower.includes('fi') || lower.includes('fade-in');
      const hasFO = lower.includes('fade out') || lower.includes('fo') || lower.includes('fade-out');
      const hasFU = lower.includes('ducking') || lower.includes('fu') || lower.includes('fade up') || lower.includes('swell');
      const hasSFX = lower.includes('sfx') || lower.includes('sound') || lower.includes('เสียงเอฟเฟกต์');
      const hasVoice = lower.includes('vo') || lower.includes('host') || lower.includes('dj') || lower.includes('ผู้จัด') || lower.includes('ผู้ประกาศ');

      // Check Spoken Language for the ear
      const spokenLanguageIssues: string[] = [];
      if (/(\d{4,})/g.test(scriptText)) {
        spokenLanguageIssues.push('พบตัวเลขหลายหลักติดกัน (เช่น ตัวเลขปีหรือสถิติ) แนะนำให้สะกดเป็นคำอ่านเต็มเพื่อให้ผู้จัดออกเสียงไม่สะดุด');
      }
      if (/และ|ซึ่ง|อัน|ที่/g.test(scriptText) && scriptText.length > 300) {
        spokenLanguageIssues.push('ควรหลีกเลี่ยงประโยคความซ้อนที่ยาวเกินไป ภาษาเพื่อการฟังควรเน้น 1 ประโยค 1 ใจความหลัก');
      }
      if (/ร|ล|เรือ|ลิง|เร็ว|เลี้ยว/g.test(scriptText)) {
        spokenLanguageIssues.push('ตรวจเช็คคำควบกล้ำ ร/ล ให้คมชัดตามหลักผู้ประกาศข่าววิทยุกระจายเสียง');
      }

      // Calculate Scores
      const timeDiff = Math.abs(estimatedSeconds - targetSeconds);
      let timingScore = 30;
      if (timeDiff <= 2) timingScore = 30;
      else if (timeDiff <= 5) timingScore = 25;
      else if (timeDiff <= 10) timingScore = 18;
      else timingScore = 10;

      let techniqueScore = 10;
      if (hasFI) techniqueScore += 4;
      if (hasFO) techniqueScore += 4;
      if (hasFU) techniqueScore += 3;
      if (hasSFX) techniqueScore += 2;
      if (hasVoice) techniqueScore += 2;

      let structureScore = 24;
      let languageScore = spokenLanguageIssues.length === 0 ? 20 : 16;
      let readinessScore = timingScore + techniqueScore + structureScore + languageScore;
      readinessScore = Math.min(100, Math.max(50, readinessScore));

      const isWithinLimit = scriptType === 'spot_30s' ? estimatedSeconds <= 32 : timeDiff <= 10;

      // If Gemini AI is configured, enhance critique
      if (ai) {
        try {
          const prompt = `คุณคือผู้เชี่ยวชาญการตรวจทานบทวิทยุและสื่อเสียงกระจายเสียงมืออาชีพ (Senior Radio Script Doctor & Audio Director)
จงตรวจทานบทต่อไปนี้ใน 3 ด้านหลัก:
1) ตรวจสอบจำนวนคำและความสอดคล้องของเวลากับความยาวรายการ (เป้าหมาย: ${targetSeconds} วินาที)
2) ตรวจสอบการระบุคำสั่งเทคนิคเสียง (FI = Fade In, FO = Fade Out, FU = Fade Up/Ducking, Voice/VO, SFX) ว่าถูกต้องตามหลักภาษาเพื่อการฟัง (Spoken Language for the Ear) หรือไม่
3) คำนวณคะแนนความสมบูรณ์ของบทวิทยุ 0-100%

บทวิทยุ:
"""
${scriptText}
"""

ตอบกลับมาเป็น JSON ตามโครงสร้างนี้เท่านั้น:
{
  "readinessScore": 88,
  "verdict": "พร้อมออกอากาศ (Broadcast Ready) / ต้องปรับแต่งเล็กน้อย",
  "timeAnalysis": {
    "wordCount": ${wordCount},
    "estimatedSeconds": ${estimatedSeconds},
    "targetSeconds": ${targetSeconds},
    "isWithinLimit": ${isWithinLimit},
    "timingComment": "คำอธิบายความสอดคล้องของเวลากับเป้าหมาย"
  },
  "soundTechniques": {
    "hasFI": ${hasFI},
    "hasFO": ${hasFO},
    "hasFU": ${hasFU},
    "hasVoice": ${hasVoice},
    "hasSFX": ${hasSFX},
    "techniqueFeedback": "ประเมินคำสั่ง FI/FO/FU/SFX/VO",
    "spokenLanguageTips": "คำแนะนำภาษาเพื่อการฟัง (Spoken language vs written text)"
  },
  "scoreBreakdown": {
    "structure": ${structureScore},
    "timing": ${timingScore},
    "soundTechniques": ${techniqueScore},
    "spokenLanguage": ${languageScore}
  },
  "recommendations": [
    "ข้อเสนอแนะปรับปรุงที่ 1",
    "ข้อเสนอแนะปรับปรุงที่ 2"
  ]
}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.6,
            },
          });

          const rawText = response.text || '{}';
          const parsed = JSON.parse(rawText);
          return res.json({ success: true, analysis: parsed, source: 'gemini-3.8-flash' });
        } catch (genError) {
          console.warn('Gemini API call error, using studio heuristic fallback:', genError);
        }
      }

      // Studio Heuristic Analysis (Guaranteed 100% Reliable Fallback)
      const recommendations: string[] = [];
      if (!hasFI) recommendations.push('ควรเพิ่มคำสั่ง [FI / Fade In] เพื่อเปิดดนตรีอย่างนุ่มนวลในช่วงต้น');
      if (!hasFO) recommendations.push('ควรระบุคำสั่ง [FO / Fade Out] เมื่อจบประโยคสุดท้ายเพื่อไม่ให้ดนตรีตัดฉับ');
      if (!hasFU) recommendations.push('ควรระบุคำสั่ง [Ducking / Fade Down -12dB] ให้ดนตรีลดระดับเสียงลงขณะมีเสียงพูด');
      if (timeDiff > 4) {
        recommendations.push(
          estimatedSeconds > targetSeconds
            ? `ความยาวเสียงพูดประมาณ ${estimatedSeconds}s เกินเป้าหมาย ${targetSeconds}s แนะนำให้ตัดทอนประโยคขยายออก`
            : `ความยาวเสียงพูดประมาณ ${estimatedSeconds}s สั้นกว่าเป้าหมาย ${targetSeconds}s สามารถเพิ่มรายละเอียดหรือขยายประเด็นได้อีกเล็กน้อย`
        );
      }
      recommendations.push('ใช้หลักภาษาเพื่อการฟัง: 1 ประโยค 1 ใจความหลัก เน้นคำกระชับที่ออกเสียงได้ลื่นไหล');

      return res.json({
        success: true,
        analysis: {
          readinessScore,
          verdict: readinessScore >= 85 ? 'พร้อมออกอากาศ (Broadcast Ready)' : 'ปรับปรุงเทคนิคเสียงและเวลาเล็กน้อย',
          timeAnalysis: {
            wordCount,
            estimatedSeconds,
            targetSeconds,
            isWithinLimit,
            timingComment: `บทมีความยาวรวม ${wordCount} คำ (ประมาณ ${estimatedSyllables} พยางค์) อ่านได้ประมาณ ${estimatedSeconds} วินาที เทียบกับเป้าหมาย ${targetSeconds} วินาที ${
              timeDiff <= 2
                ? '✓ ตรงเป้าหมายดีเยี่ยม บวกลบไม่เกิน 2 วินาที'
                : estimatedSeconds > targetSeconds
                ? `▲ เกินเป้าหมาย ${timeDiff} วินาที ควรตัดคำฟุ่มเฟือย`
                : `▼ สั้นกว่าเป้าหมาย ${timeDiff} วินาที สามารถเพิ่มเสียงประกอบหรือดนตรีได้`
            }`,
          },
          soundTechniques: {
            hasFI,
            hasFO,
            hasFU,
            hasVoice,
            hasSFX,
            techniqueFeedback: `ตรวจพบคำสั่งเทคนิค: ${[
              hasFI ? 'FI (Fade In)' : null,
              hasFO ? 'FO (Fade Out)' : null,
              hasFU ? 'FU / Ducking' : null,
              hasSFX ? 'SFX (Sound Effects)' : null,
              hasVoice ? 'VO (Voice Lines)' : null,
            ]
              .filter(Boolean)
              .join(', ') || 'ยังไม่มีการระบุคำสั่งเทคนิคเสียงที่ชัดเจน'}`,
            spokenLanguageTips:
              spokenLanguageIssues.length > 0
                ? spokenLanguageIssues.join(' • ')
                : 'ภาษาเขียนมีจังหวะการเว้นวรรคเหมาะสม ประโยคไม่ยาวเกินไป ออกเสียงได้เป็นธรรมชาติ',
          },
          scoreBreakdown: {
            structure: structureScore,
            timing: timingScore,
            soundTechniques: techniqueScore,
            spokenLanguage: languageScore,
          },
          recommendations,
        },
        source: 'studio-expert-engine',
      });
    } catch (err: any) {
      console.error('AI Review Error:', err);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการประมวลผลบท: ' + (err.message || 'Unknown error') });
    }
  });

  // Mount Vite in development or static in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎙️ SoundCraft Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
