import { env } from "cloudflare:workers";

const schema = {
  type: "object",
  properties: {
    title: { type: "string" }, recommendation: { type: "string" }, reason: { type: "string" },
    steps: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
    risk: { type: "string", enum: ["low", "moderate", "high"] },
    stop_condition: { type: "string" }, uncertainty: { type: ["string", "null"] },
  },
  required: ["title", "recommendation", "reason", "steps", "risk", "stop_condition", "uncertainty"],
  additionalProperties: false,
};

const developerPrompt = `You are Knox Advisor, an assistant exclusively for Project Zomboid.
Only answer requests about Project Zomboid. Base every recommendation on the supplied survivor record, game build, sandbox mode, recent journal entries, and the player's request.
Recommend one realistic goal or course of action at a time. Prioritize survival over optimization. Never invent inventory, skills, locations, mods, or completed actions.
Keep the plan achievable in the stated playtime. Clearly distinguish Build 41 and Build 42 mechanics. If a fact is version-dependent or context is insufficient, state that in uncertainty.
Use direct, calm language for a newer player. Do not roleplay or add generic encouragement.`;

function extractText(data: Record<string, unknown>) {
  const output = Array.isArray(data.output) ? data.output : [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as { content?: unknown }).content) ? (item as { content: unknown[] }).content : [];
    for (const part of content) {
      if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") return (part as { text: string }).text;
    }
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const runtimeEnv = env as unknown as { OPENAI_API_KEY?: string };
    if (!runtimeEnv.OPENAI_API_KEY) return Response.json({ error: "Knox Advisor is not connected yet. The diary still works normally." }, { status: 503 });
    const context = await request.json();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${runtimeEnv.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.6-luna", store: false, reasoning: { effort: "low" },
        input: [{ role: "developer", content: developerPrompt }, { role: "user", content: JSON.stringify(context) }],
        text: { format: { type: "json_schema", name: "knox_advice", strict: true, schema } },
      }),
    });
    if (!response.ok) {
      console.error("advisor API failed", response.status, await response.text());
      return Response.json({ error: "Knox Advisor could not respond right now." }, { status: 502 });
    }
    const text = extractText((await response.json()) as Record<string, unknown>);
    if (!text) return Response.json({ error: "Knox Advisor returned an empty response." }, { status: 502 });
    return Response.json({ advice: JSON.parse(text) });
  } catch (error) {
    console.error("advisor request failed", error);
    return Response.json({ error: "Knox Advisor could not respond right now." }, { status: 500 });
  }
}
