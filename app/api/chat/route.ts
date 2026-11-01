import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL_ID = "bionic/beam-1.0";

export async function POST(request: Request) {
  const apiKey = process.env.LM_STUDIO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The Beam API key is not configured on the server yet. Add LM_STUDIO_API_KEY in Vercel project environment variables." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "Send at least one message." }, { status: 400 });
    }

    const messages = body.messages
      .filter((message: { role?: unknown; content?: unknown }) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      )
      .slice(-40)
      .map((message: { role: "user" | "assistant"; content: string }) => ({
        role: message.role,
        content: message.content.slice(0, 20000)
      }));

    if (messages.length === 0) {
      return NextResponse.json({ error: "No valid messages were provided." }, { status: 400 });
    }

    const client = new OpenAI({
      baseURL: "https://api.lmstudio.ai/v1",
      apiKey
    });

    const completion = await client.chat.completions.create({
      model: MODEL_ID,
      messages,
      max_tokens: 2048
    });

    const content = completion.choices[0]?.message?.content;
    if (typeof content !== "string" || content.length === 0) {
      return NextResponse.json({ error: "Beam returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ content, model: MODEL_ID });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown provider error.";
    return NextResponse.json(
      { error: `Beam request failed: ${message}` },
      { status: 502 }
    );
  }
}
