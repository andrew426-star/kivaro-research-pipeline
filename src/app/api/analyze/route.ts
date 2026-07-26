import { NextResponse } from "next/server"
import { Type } from "@google/genai"

import { GEMINI_MODEL, getGeminiClient } from "@/lib/gemini-client"

const MAX_INPUT_CHARS = 20_000

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A tight 2-3 sentence executive summary of the document.",
    },
    keyMetrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING },
          context: { type: Type.STRING, description: "Why this metric matters, one short clause." },
        },
        required: ["label", "value", "context"],
      },
    },
    notableChanges: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Notable changes, new disclosures, or shifts in emphasis versus what a reader familiar with this type of document would expect.",
    },
    riskFlags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, format: "enum", enum: ["low", "medium", "high"] },
          description: { type: Type.STRING },
        },
        required: ["severity", "description"],
      },
    },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        tone: { type: Type.STRING, description: "A short label, e.g. 'Cautiously confident'." },
        rationale: { type: Type.STRING },
      },
      required: ["tone", "rationale"],
    },
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific questions a research analyst should dig into next, grounded in this document.",
    },
  },
  required: ["summary", "keyMetrics", "notableChanges", "riskFlags", "sentiment", "followUpQuestions"],
}

function buildPrompt(documentText: string): string {
  return `You are an investment research analyst. Analyze the following document (a filing excerpt, earnings call transcript, or similar) and extract structured, actionable intelligence from it. Be specific and ground every point in the actual text — do not invent facts not present in the document. If the document doesn't mention a category (e.g. no numeric metrics are present), return an empty array for that field rather than fabricating one.

DOCUMENT:
"""
${documentText}
"""`
}

export async function POST(request: Request) {
  let documentText: string
  try {
    const body = await request.json()
    documentText = typeof body.text === "string" ? body.text.trim() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!documentText) {
    return NextResponse.json({ error: "No document text provided." }, { status: 422 })
  }
  if (documentText.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Document is too long (max ${MAX_INPUT_CHARS.toLocaleString()} characters).` },
      { status: 422 }
    )
  }

  try {
    const client = getGeminiClient()
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(documentText),
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    })

    const raw = response.text
    if (!raw) throw new Error("Gemini returned an empty response.")

    const brief = JSON.parse(raw)
    return NextResponse.json({ brief })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to analyze document." },
      { status: 502 }
    )
  }
}
