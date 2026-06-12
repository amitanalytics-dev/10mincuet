import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  if (!question) {
    return NextResponse.json({ error: "No question" }, { status: 400 });
  }

  const msg = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are an expert CUET UG teacher. Solve this question step by step, referencing the relevant NCERT chapter where applicable.

Question: ${question}

Format your answer as:
1. Identify the concept and NCERT reference (book, chapter, page if known)
2. Key formula/principle to apply
3. Step-by-step solution
4. Common mistake to avoid

Keep it concise — CUET student needs to understand fast.`,
      },
    ],
  });

  const answer =
    msg.content[0].type === "text" ? msg.content[0].text : "";
  return NextResponse.json({ answer });
}
