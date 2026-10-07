import OpenAI from "openai";
import { NextResponse } from "next/server";

const AI_API_KEY = process.env.AI_API_KEY || process.env.GROQ_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "openai/gpt-oss-120b";
const AI_REASONING_EFFORT = process.env.AI_REASONING_EFFORT as "low" | "medium" | "high" | undefined;

const client = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  if (!AI_API_KEY) {
    return NextResponse.json({ error: "Clé API manquante." }, { status: 500 });
  }
  try {
    const { text, instruction } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 3) {
      return NextResponse.json({ error: "Texte manquant." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.7,
      max_completion_tokens: 500,
      ...(AI_REASONING_EFFORT ? { reasoning_effort: AI_REASONING_EFFORT } : {}),
      messages: [
        { role: "system", content: "Tu es un copywriter francophone. Améliore le texte fourni selon l'instruction. Réponds UNIQUEMENT avec le texte final, sans guillemets, sans explication." },
        { role: "user", content: `Instruction : ${instruction || "Rendre plus professionnel."}\n\nTexte :\n${text}` },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      return NextResponse.json({ error: "Réponse IA vide." }, { status: 502 });
    }
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Erreur API refine :", error?.message || error);
    return NextResponse.json({ error: "Erreur lors du raffinement." }, { status: 500 });
  }
}