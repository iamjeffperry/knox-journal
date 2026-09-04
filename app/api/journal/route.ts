import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, survivors } from "@/db/schema";

function clean(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
}

export async function GET() {
  try {
    const db = getDb();
    const [survivorRows, sessionRows] = await Promise.all([
      db.select().from(survivors).orderBy(desc(survivors.updatedAt)),
      db.select().from(sessions).orderBy(desc(sessions.createdAt)),
    ]);
    return Response.json({ survivors: survivorRows, sessions: sessionRows });
  } catch (error) {
    console.error("journal load failed", error);
    return Response.json({ error: "The journal is temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const db = getDb();

    if (payload.action === "create-survivor") {
      const name = clean(payload.name);
      const town = clean(payload.town);
      const occupation = clean(payload.occupation);
      if (!name || !town || !occupation) return Response.json({ error: "Name, town, and occupation are required." }, { status: 400 });
      const [survivor] = await db.insert(survivors).values({
        id: crypto.randomUUID(), name, town, occupation,
        build: clean(payload.build, "42"), gameMode: clean(payload.gameMode, "Survivor"),
        traits: clean(payload.traits), runGoal: clean(payload.runGoal),
      }).returning();
      return Response.json({ survivor }, { status: 201 });
    }

    const survivorId = clean(payload.survivorId);
    if (!survivorId) return Response.json({ error: "A survivor is required." }, { status: 400 });

    if (payload.action === "log-session") {
      const day = number(payload.day, 1);
      const summary = clean(payload.summary);
      if (!summary) return Response.json({ error: "Tell the journal what happened." }, { status: 400 });
      const nextObjective = clean(payload.nextObjective);
      const outcome = clean(payload.outcome, "alive");
      await db.batch([
        db.insert(sessions).values({
          id: crypto.randomUUID(), survivorId, day,
          title: clean(payload.title, `Day ${day}`), summary,
          lesson: clean(payload.lesson), nextObjective, outcome,
        }),
        db.update(survivors).set({
          day, hours: number(payload.hours), kills: number(payload.kills),
          condition: clean(payload.condition, "Healthy"), base: clean(payload.base, "None yet"),
          vehicle: clean(payload.vehicle, "None"), weapon: clean(payload.weapon, "Unarmed"),
          supplies: clean(payload.supplies, "Unknown"),
          ...(nextObjective ? { currentObjective: nextObjective } : {}),
          status: outcome === "dead" ? "dead" : "alive",
          causeOfDeath: outcome === "dead" ? clean(payload.causeOfDeath, "Unknown") : null,
          endedAt: outcome === "dead" ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        }).where(eq(survivors.id, survivorId)),
      ]);
      return Response.json({ ok: true }, { status: 201 });
    }

    if (payload.action === "set-objective") {
      const objective = clean(payload.objective);
      if (!objective) return Response.json({ error: "An objective is required." }, { status: 400 });
      await db.update(survivors).set({ currentObjective: objective, updatedAt: new Date().toISOString() }).where(eq(survivors.id, survivorId));
      return Response.json({ ok: true });
    }

    if (payload.action === "delete-session") {
      const sessionId = clean(payload.sessionId);
      if (!sessionId) return Response.json({ error: "A journal entry is required." }, { status: 400 });
      await db.delete(sessions).where(and(eq(sessions.id, sessionId), eq(sessions.survivorId, survivorId)));
      await db.update(survivors).set({ updatedAt: new Date().toISOString() }).where(eq(survivors.id, survivorId));
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Unknown journal action." }, { status: 400 });
  } catch (error) {
    console.error("journal update failed", error);
    return Response.json({ error: "The journal could not save that entry." }, { status: 500 });
  }
}
