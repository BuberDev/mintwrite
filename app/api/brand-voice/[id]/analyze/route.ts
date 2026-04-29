import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth/session";
import { getBrandVoiceById, saveBrandVoiceAnalysis } from "@/lib/db/brand-voice";
import { getOpenRouterModel, isOpenRouterConfigured } from "@/lib/ai/openrouter";
import { generateText } from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

// POST /api/brand-voice/[id]/analyze — run AI analysis on samples
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  try {
    const voice = await getBrandVoiceById(params.id, userId);
    if (!voice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!isOpenRouterConfigured()) {
      return NextResponse.json({ error: "AI not configured" }, { status: 503 });
    }

    const samplesText = voice.samples.join("\n\n---\n\n");

    const analysisPrompt = `You are a brand voice analyst. Analyze the following content samples and extract the author's unique writing style.

CONTENT SAMPLES:
${samplesText}

Return a JSON object with EXACTLY this structure (no markdown, no explanation, just raw JSON):
{
  "tone": ["3-5 single adjectives describing emotional tone, e.g. confident, direct, curious"],
  "style": ["3-5 stylistic characteristics, e.g. uses-short-sentences, avoids-jargon, data-driven"],
  "keywords": ["8-12 domain keywords or phrases the author frequently uses"],
  "sentenceLength": "short|medium|long",
  "formalityLevel": "casual|neutral|professional|technical",
  "summary": "One sentence describing this author's unique voice (max 20 words)"
}`;

    const result = await generateText({
      model: getOpenRouterModel(),
      prompt: analysisPrompt,
      temperature: 0.3,
    });

    // Parse the JSON from the AI response
    const raw = result.text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned invalid analysis" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    const saved = await saveBrandVoiceAnalysis(params.id, userId, analysis);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("[brand-voice/[id]/analyze] error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
