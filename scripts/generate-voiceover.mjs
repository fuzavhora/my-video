import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

// 1. Configure Product Information
const PRODUCT_CONFIG = {
  name: "Alangkart ERP",
  problem: "manual boutique management and lost security deposits",
  feature1: "real-time inventory availability calendar",
  feature2: "automated WhatsApp billing and barcode scanning",
  benefit: "double your booking capacity with zero double-bookings"
};

const scriptText = `${PRODUCT_CONFIG.name} is the ultimate solution for ${PRODUCT_CONFIG.problem}. With features like ${PRODUCT_CONFIG.feature1} and ${PRODUCT_CONFIG.feature2}, it helps you ${PRODUCT_CONFIG.benefit}. Try it today!`;

console.log("📝 Generating Voiceover for Script:\n", scriptText);

const ai = new GoogleGenAI({ apiKey });

async function generateTTS() {
  try {
    console.log("🎙️ Connecting to Gemini API (model: gemini-3.8-flash-tts)...");

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-tts",
      contents: scriptText,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede" // Available voices: Aoede, Charon, Fenrir, Kore, Puck
            }
          }
        }
      }
    });

    const candidate = response.candidates?.[0];
    const partWithAudio = candidate?.content?.parts?.find(
      (p) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/")
    );

    if (!partWithAudio?.inlineData?.data) {
      console.log("Candidate response:", JSON.stringify(candidate, null, 2));
      throw new Error("No audio payload returned from Gemini API.");
    }

    const rawBuffer = Buffer.from(partWithAudio.inlineData.data, "base64");
    const mimeType = partWithAudio.inlineData.mimeType || "audio/wav";
    console.log(`🔊 Received audio stream (MIME: ${mimeType}, Size: ${(rawBuffer.length / 1024).toFixed(1)} KB)`);

    const outputDir = path.join(__dirname, "../public");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, "audio.mp3");
    fs.writeFileSync(outputPath, rawBuffer);

    console.log(`✅ Voiceover successfully saved at: ${outputPath}`);
  } catch (err) {
    console.error("❌ Failed to synthesize audio via Gemini:", err);
    process.exit(1);
  }
}

generateTTS();
