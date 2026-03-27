import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a senior software architect.
Given a product idea, generate a complete technical specification as a JSON object.

IMPORTANT: Respond with the raw JSON object directly — no wrapper keys, no markdown fences, no extra text.
The root object must have exactly these 6 keys:

{
  "vision": "<string, 2-4 sentences describing the product vision, core purpose, and value proposition>",
  "users": "<string, 2-4 sentences describing the target users, their context, and their main pain points>",
  "features": [
    "El usuario puede ... (or El sistema permite ...)",
    "... between 5 and 8 items total ..."
  ],
  "flows": [
    {
      "name": "<short flow name>",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "error_path": "<what happens if this flow fails>"
    }
  ],
  "architecture": "<string, 2-4 sentences describing the technical architecture, stack choices, and system design>",
  "requirements": "<string, 2-4 sentences covering the key functional and non-functional requirements>"
}

Rules:
- features: array of strings, 5–8 items, each starting with 'El usuario puede' or 'El sistema permite'.
- flows: array of objects, 3–5 items. Each object must have exactly: name (string), steps (array of strings with the happy-path steps in order), error_path (string describing what happens if the flow fails).
- vision, users, architecture, requirements: plain strings of exactly 2–4 sentences — not one line, not a long paragraph.
- Output only the JSON object. No wrapper object, no extra keys, no explanation.

IMPORTANT: Return the JSON object directly. Do NOT wrap it in any parent key like spec, data, result or any other wrapper. The root of your response must be the JSON object itself.`;

export async function POST(request: NextRequest) {
  let description: string;

  try {
    const body = await request.json();
    description = body.description;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON with a 'description' field." },
      { status: 400 },
    );
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return NextResponse.json(
      { error: "The 'description' field is required and must be a non-empty string." },
      { status: 400 },
    );
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Generate a technical specification for the following product idea:\n\n${description.trim()}`,
        },
      ],
    });

    const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === 'text');

    if (!textBlock) {
      return NextResponse.json({ error: 'No text response received from the model.' }, { status: 500 });
    }

    let spec: Record<string, string | string[]>;
    try {
      let rawText = textBlock.text.trim();
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      spec = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'The model returned an invalid JSON response.', raw: textBlock.text },
        { status: 500 },
      );
    }

    return NextResponse.json({ spec });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid or missing Anthropic API key.' }, { status: 401 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Anthropic API error: ${error.message}` }, { status: 502 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
