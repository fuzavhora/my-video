import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY is not set in .env");
  process.exit(1);
}

const inputVideoPath = process.argv[2] || path.join(__dirname, '../public/alangkart-perfect-balance.mp4');

if (!fs.existsSync(inputVideoPath)) {
  console.error(`❌ Input video not found at: ${inputVideoPath}`);
  process.exit(1);
}

console.log(`🎬 Processing Uploaded Video: ${inputVideoPath}`);

// 1. Extract Video Metadata using ffprobe
function getMetadata(videoPath) {
  try {
    const raw = execSync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`
    ).toString();
    const parsed = JSON.parse(raw);
    const videoStream = parsed.streams.find((s) => s.codec_type === 'video');

    const duration = parseFloat(parsed.format.duration || 0);
    const width = parseInt(videoStream?.width || 1920, 10);
    const height = parseInt(videoStream?.height || 1080, 10);
    const fps = eval(videoStream?.r_frame_rate || "30");

    const isVertical = height > width;
    const aspectRatio = isVertical ? "9:16" : width === height ? "1:1" : "16:9";

    return { duration, width, height, fps: Math.round(fps), aspectRatio };
  } catch (e) {
    console.warn("ffprobe error, using fallbacks:", e.message);
    return { duration: 18, width: 1920, height: 1080, fps: 30, aspectRatio: "16:9" };
  }
}

// 2. Extract Keyframes using ffmpeg
function extractKeyframes(videoPath, outputDir, maxFrames = 4) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  console.log("📸 Extracting keyframes for Gemini Multimodal Analysis...");
  
  // Extract 1 frame every 4 seconds
  const framePattern = path.join(outputDir, 'frame_%02d.jpg');
  try {
    execSync(`ffmpeg -y -i "${videoPath}" -vf "fps=1/4" -frames:v ${maxFrames} "${framePattern}"`, { stdio: 'ignore' });
  } catch (e) {
    console.warn("ffmpeg frame extraction warning:", e.message);
  }

  return fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.jpg'))
    .map(f => path.join(outputDir, f));
}

async function analyzeWithGemini() {
  const meta = getMetadata(inputVideoPath);
  console.log(`📊 Video Metadata: ${meta.width}x${meta.height} (${meta.aspectRatio}), Duration: ${meta.duration.toFixed(1)}s, FPS: ${meta.fps}`);

  const framesDir = path.join(__dirname, '../public/extracted_frames');
  const frameFiles = extractKeyframes(inputVideoPath, framesDir, 4);

  console.log(`🤖 Sending ${frameFiles.length} frames to Gemini AI for Category Identification & Video Blueprint...`);

  const ai = new GoogleGenAI({ apiKey });

  // Prepare image parts for Gemini
  const imageParts = frameFiles.map(filePath => ({
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType: "image/jpeg"
    }
  }));

  const prompt = `You are an expert AI video director. Analyze these extracted frames from an uploaded user video.
Identify:
1. Video Category: ("software_screencast" | "mobile_social_reel" | "ecommerce_garment" | "tutorial_walkthrough")
2. Recommended Aspect Ratio: ("16:9" | "9:16" | "1:1")
3. Suggested Title & Core Product/Topic
4. Scene Breakdown with timestamps, headline overlays, detected user actions, camera zoom coordinates, and subtitle cues.

Respond ONLY with valid, strict JSON matching this schema:
{
  "metadata": {
    "title": "string",
    "category": "software_screencast" | "mobile_social_reel" | "ecommerce_garment" | "tutorial_walkthrough",
    "aspectRatio": "16:9" | "9:16" | "1:1",
    "durationSeconds": ${meta.duration},
    "recommendedFps": ${meta.fps}
  },
  "scenes": [
    {
      "startSeconds": 0,
      "endSeconds": 4.5,
      "headline": "string",
      "highlightKeyword": "string",
      "recommendedEffect": "zoom" | "slide" | "fade" | "spotlight",
      "zoom": { "scale": 1.25, "focusXPercent": 50, "focusYPercent": 40 },
      "actionSpotlight": { "xPercent": 50, "yPercent": 35, "label": "string" }
    }
  ],
  "subtitles": [
    {
      "startSeconds": 0,
      "endSeconds": 4.5,
      "text": "string",
      "emphasisWord": "string"
    }
  ]
}`;

  const candidateModels = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.8-flash"];
  let blueprint = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`📡 Trying Gemini Model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [prompt, ...imageParts],
        config: {
          responseMimeType: "application/json"
        }
      });

      const jsonText = response.text || "{}";
      blueprint = JSON.parse(jsonText);
      console.log(`✨ Successfully generated blueprint using ${modelName}!`);
      break;
    } catch (modelErr) {
      console.warn(`⚠️ Model ${modelName} unavailable (${modelErr.message}). Trying next...`);
    }
  }

  if (!blueprint) {
    throw new Error("All Gemini candidate models failed to analyze video.");
  }

  const manifestPath = path.join(__dirname, '../public/video-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(blueprint, null, 2));

    console.log("✅ AI Analysis Complete! Blueprint generated at:");
    console.log(`📄 ${manifestPath}`);
    console.log("\n📋 AI Blueprint Summary:");
    console.log(`• Category: ${blueprint.metadata?.category}`);
    console.log(`• Title: ${blueprint.metadata?.title}`);
    console.log(`• Scenes Detected: ${blueprint.scenes?.length}`);
    console.log(`• Subtitle Cues: ${blueprint.subtitles?.length}`);

    return blueprint;
}

analyzeWithGemini();
