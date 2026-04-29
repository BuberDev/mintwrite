import { db } from "@/lib/db/drizzle";
import { brandVoices } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type BrandVoiceAnalysis = {
  tone: string[];
  style: string[];
  keywords: string[];
  sentenceLength: "short" | "medium" | "long";
  formalityLevel: "casual" | "neutral" | "professional" | "technical";
  summary: string;
};

export async function getBrandVoicesForUser(userId: string) {
  return db.query.brandVoices.findMany({
    where: eq(brandVoices.userId, userId),
    with: { project: true },
    orderBy: (bv, { desc }) => [desc(bv.createdAt)],
  });
}

export async function getBrandVoiceById(id: string, userId: string) {
  return db.query.brandVoices.findFirst({
    where: and(eq(brandVoices.id, id), eq(brandVoices.userId, userId)),
    with: { project: true },
  });
}

export async function getBrandVoiceForProject(projectId: string) {
  return db.query.brandVoices.findFirst({
    where: and(
      eq(brandVoices.projectId, projectId),
      eq(brandVoices.isAnalyzed, true)
    ),
    orderBy: (bv, { desc }) => [desc(bv.createdAt)],
  });
}

export async function createBrandVoice({
  userId,
  projectId,
  name,
  samples,
}: {
  userId: string;
  projectId?: string | null;
  name: string;
  samples: string[];
}) {
  const [bv] = await db
    .insert(brandVoices)
    .values({
      userId,
      projectId: projectId ?? null,
      name,
      samples,
      isAnalyzed: false,
    })
    .returning();
  return bv;
}

export async function saveBrandVoiceAnalysis(
  id: string,
  userId: string,
  analysis: BrandVoiceAnalysis
) {
  const [updated] = await db
    .update(brandVoices)
    .set({ analysis, isAnalyzed: true, updatedAt: new Date() })
    .where(and(eq(brandVoices.id, id), eq(brandVoices.userId, userId)))
    .returning();
  return updated;
}

export async function deleteBrandVoice(id: string, userId: string) {
  await db
    .delete(brandVoices)
    .where(and(eq(brandVoices.id, id), eq(brandVoices.userId, userId)));
}

// ─── Brand Voice → Prompt Injection ──────────────────────────────────────────

export function buildBrandVoiceContext(analysis: BrandVoiceAnalysis): string {
  if (!analysis) return "";

  return `
## User Brand Voice Override

The user has a defined custom brand voice. Apply it strictly to all output:

**Detected Tone:** ${analysis.tone.join(", ")}
**Writing Style:** ${analysis.style.join(", ")}
**Key Vocabulary:** ${analysis.keywords.join(", ")}
**Sentence Length:** ${analysis.sentenceLength}
**Formality Level:** ${analysis.formalityLevel}

**Voice Summary:** ${analysis.summary}

Mirror this voice precisely. Do not default to generic Web3 marketing copy — the user's distinctive style takes priority.
`.trim();
}
