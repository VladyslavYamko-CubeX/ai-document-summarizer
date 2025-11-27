import { NextResponse } from "next/server";

import { summarizeWithOpenAI, type SummaryLength, type SummaryTone } from "@/lib/openai";

const MAX_CHARACTERS = 50000;

function isValidKey(apiKey: unknown): apiKey is string {
  return typeof apiKey === "string" && apiKey.startsWith("sk-") && apiKey.length > 20;
}

export async function POST(request: Request) {
  try {
    const { apiKey, content, length, tone } = (await request.json()) as {
      apiKey?: string;
      content?: string;
      length?: SummaryLength;
      tone?: SummaryTone;
    };

    if (!isValidKey(apiKey)) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const originalCharacters = content.length;
    let workingContent = content;
    let truncated = false;

    if (content.length > MAX_CHARACTERS) {
      workingContent = content.slice(0, MAX_CHARACTERS);
      truncated = true;
    }

    const result = await summarizeWithOpenAI({
      apiKey,
      content: workingContent,
      length: length ?? "medium",
      tone: tone ?? "neutral"
    });

    const summary = truncated
      ? `${result.summary}\n\nNote: Input truncated to the first ${MAX_CHARACTERS.toLocaleString()} characters.`
      : result.summary;

    return NextResponse.json({
      summary,
      bullets: result.bullets,
      originalCharacters
    });
  } catch (error) {
    console.error("Summarization error", error);
    return NextResponse.json(
      { error: "Failed to summarize content. Check your API key and try again." },
      { status: 500 }
    );
  }
}
