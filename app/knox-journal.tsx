"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, Brain, ChevronDown, CirclePlus, Crosshair, HeartPulse, Lightbulb, LoaderCircle, Menu, NotebookTabs, Skull, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Survivor = {
  id: string; name: string; status: string; build: string; town: string; occupation: string;
  traits: string; gameMode: string; day: number; hours: number; kills: number; condition: string;
  base: string; vehicle: string; weapon: string; supplies: string; currentObjective: string;
  runGoal: string; causeOfDeath: string | null; updatedAt: string;
};
type Session = { id: string; survivorId: string; day: number; title: string; summary: string; lesson: string; nextObjective: string; outcome: string; createdAt: string };
type Advice = { title: string; recommendation: string; reason: string; steps: string[]; risk: "low" | "moderate" | "high"; stop_condition: string; uncertainty: string | null };

const towns = ["Rosewood", "Riverside", "Muldraugh", "West Point", "Echo Creek", "Louisville", "Other"];
const occupations = ["Unemployed", "Burglar", "Fire Officer", "Lumberjack", "Park Ranger", "Police Officer", "Repairman", "Veteran", "Other"];

export default function KnoxJournal() {
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [requestType, setRequestType] = useState("Suggest my next goal");
  const [playtime, setPlaytime] = useState("45 minutes");
  const [risk, setRisk] = useState("Safe and simple");

  const selected = survivors.find((survivor) => survivor.id === selectedId) ?? survivors[0];
  const selectedSessions = useMemo(() => sessions.filter((session) => session.survivorId === selected?.id), [sessions, selected?.id]);

  async function loadJournal(preferredId?: string) {
    setMessage("");
    try {
      const response = await fetch("/api/journal", { cache: "no-store" });
      const data = await response.json() as { survivors?: Survivor[]; sessions?: Session[]; error?: string };
      if (!response.ok) throw new Error(data.error);
      setSurvivors(data.survivors ?? []);
      setSessions(data.sessions ?? []);
      setSelectedId((current) => preferredId ?? current ?? data.survivors?.[0]?.id ?? "");
    } catch (error) { setMessage(error instanceof Error ? error.message : "The journal could not load."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadJournal(); }, []);

  async function sendJournalAction(payload: Record<string, unknown>) {
    const response = await fetch("/api/journal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json() as { survivor?: Survivor; error?: string };
    if (!response.ok) throw new Error(data.error ?? "That could not be saved.");
    await loadJournal(data.survivor?.id ?? selected?.id);
  }

  async function createSurvivor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await sendJournalAction({ action: "create-survivor", ...Object.fromEntries(new FormData(event.currentTarget)) });
      setCreateOpen(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "The survivor could not be created."); }
  }

  async function logSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    try {
      await sendJournalAction({ action: "log-session", survivorId: selected.id, ...Object.fromEntries(new FormData(event.currentTarget)) });
      setLogOpen(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "The session could not be saved."); }
  }

  async function askAdvisor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setAdvisorLoading(true); setAdvice(null); setMessage("");
    try {
      const extra = String(new FormData(event.currentTarget).get("extra") ?? "");
      const response = await fetch("/api/advisor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: requestType, playtime, risk, extra, survivor: selected, recentSessions: selectedSessions.slice(0, 3) }),
      });
      const data = await response.json() as { advice?: Advice; error?: string };
      if (!response.ok || !data.advice) throw new Error(data.error ?? "Knox Advisor could not respond.");
      setAdvice(data.advice);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Knox Advisor could not respond."); }
    finally { setAdvisorLoading(false); }
  }

  async function useObjective() {
    if (!selected || !advice) return;
    try {
      await sendJournalAction({ action: "set-objective", survivorId: selected.id, objective: advice.recommendation });
      setAdvisorOpen(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "The objective could not be saved."); }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b-2 border-primary bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3"><NotebookTabs className="size-5 text-primary" /><span className="font-mono text-sm font-semibold tracking-[0.18em]">KNOX JOURNAL</span></div>
          <div className="font-mono text-xs text-muted-foreground">APOCALYPSE LOG // BUILD 42</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`${menuOpen ? "block" : "hidden"} border-b bg-sidebar p-4 lg:block lg:min-h-[calc(100vh-4rem)] lg:border-r lg:border-b-0`}>
          <div className="mb-6 grid grid-cols-3 gap-1 lg:grid-cols-1">
            <button className="nav-entry active"><Crosshair />Current run</button>
            <button className="nav-entry"><BookOpen />Run log</button>
            <button className="nav-entry"><Brain />Lessons</button>
          </div>
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">SURVIVORS</span>
            <button aria-label="Create survivor" onClick={() => setCreateOpen(true)} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><CirclePlus className="size-4" /></button>
          </div>
          <div className="space-y-1">{survivors.map((survivor) => <button key={survivor.id} onClick={() => { setSelectedId(survivor.id); setMenuOpen(false); }} className={`survivor-entry ${selected?.id === survivor.id ? "selected" : ""}`}><span className="truncate">{survivor.name}</span>{survivor.status === "alive" ? <HeartPulse className="size-4 text-success" /> : <Skull className="size-4 text-muted-foreground" />}</button>)}</div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Button variant="outline" size="sm" className="mb-4 lg:hidden" onClick={() => setMenuOpen((value) => !value)}><Menu /> Survivors</Button>
          {message && <div className="mb-5 flex items-start justify-between gap-4 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm"><span>{message}</span><button aria-label="Dismiss message" onClick={() => setMessage("")}><X className="size-4" /></button></div>}

          {loading ? <div className="flex min-h-[60vh] items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" /></div> : !selected ? (
            <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-2xl bg-primary/10 p-5"><NotebookTabs className="size-10 text-primary" /></div>
              <p className="mb-2 font-mono text-xs tracking-[0.16em] text-primary">NO ACTIVE RUN</p>
              <h1 className="text-3xl font-semibold tracking-tight">Start your first survivor journal.</h1>
              <p className="mt-4 max-w-md text-muted-foreground">Remember where you left off, turn mistakes into lessons, and ask Knox Advisor for a sensible next move.</p>
              <Button className="mt-7" onClick={() => setCreateOpen(true)}><CirclePlus /> Create survivor</Button>
            </div>
          ) : <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div><p className="mb-1 font-mono text-xs tracking-[0.14em] text-primary">{selected.status === "alive" ? "ACTIVE SURVIVOR" : "RUN ENDED"}</p><h1 className="text-3xl font-semibold tracking-tight">{selected.name}</h1><p className="mt-1 text-sm text-muted-foreground">{selected.town} · {selected.occupation} · Build {selected.build} · {selected.gameMode}</p></div>
              {selected.status === "alive" && <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setAdvice(null); setAdvisorOpen(true); }}><Sparkles /> Ask Knox Advisor</Button><Button onClick={() => setLogOpen(true)}><CirclePlus /> Log session</Button></div>}
            </div>
            <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4"><Stat label="Survived" value={`Day ${selected.day}, ${selected.hours}h`} /><Stat label="Zombies killed" value={String(selected.kills)} /><Stat label="Condition" value={selected.condition} /><Stat label="Status" value={selected.status === "alive" ? "Still breathing" : "Deceased"} /></div>
            <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
              <div className="space-y-5">
                <section className="journal-panel"><div className="panel-heading"><Target className="size-4 text-primary" /><h2>Next objective</h2></div><div className="objective-box"><strong>{selected.currentObjective}</strong><span>Keep it small enough to finish in one session.</span></div><div className="mt-4 flex flex-wrap gap-2"><Badge variant="secondary">Base: {selected.base}</Badge><Badge variant="secondary">Vehicle: {selected.vehicle}</Badge><Badge variant="secondary">Weapon: {selected.weapon}</Badge><Badge variant="secondary">Supplies: {selected.supplies}</Badge></div></section>
                <section className="journal-panel"><div className="panel-heading"><BookOpen className="size-4 text-primary" /><h2>Recent log</h2></div>{selectedSessions.length ? <div className="divide-y divide-border">{selectedSessions.slice(0, 5).map((session) => <article key={session.id} className="grid gap-2 py-4 sm:grid-cols-[78px_1fr]"><span className="font-mono text-xs text-primary">DAY {session.day}</span><div><h3 className="font-medium">{session.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{session.summary}</p>{session.lesson && <p className="mt-2 flex items-start gap-2 text-sm"><Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />{session.lesson}</p>}</div></article>)}</div> : <EmptyLine text="No sessions logged yet. Your first entry can be only a sentence or two." />}</section>
              </div>
              <div className="space-y-5">
                <section className="journal-panel"><div className="panel-heading"><Crosshair className="size-4 text-primary" /><h2>Run facts</h2></div><dl className="facts"><Fact label="Goal" value={selected.runGoal || "Survive and learn"} /><Fact label="Traits" value={selected.traits || "Not recorded"} /><Fact label="Current weapon" value={selected.weapon} /><Fact label="Vehicle" value={selected.vehicle} /></dl></section>
                <section className="journal-panel advisor-callout"><Sparkles className="size-5 text-primary" /><div><h2 className="font-semibold">Need a sensible next move?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Knox Advisor uses this survivor’s situation and recent mistakes to suggest one focused goal.</p><Button variant="outline" className="mt-4" onClick={() => { setAdvice(null); setAdvisorOpen(true); }}>Ask for advice <ChevronDown /></Button></div></section>
              </div>
            </div>
          </>}
        </section>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Create a survivor</DialogTitle><DialogDescription>Record the basics. You can fill in the rest after playing.</DialogDescription></DialogHeader><form onSubmit={createSurvivor} className="space-y-4"><Field label="Survivor name" name="name" required /><div className="grid grid-cols-2 gap-3"><NativeChoice label="Starting town" name="town" options={towns} /><NativeChoice label="Occupation" name="occupation" options={occupations} /></div><div className="grid grid-cols-2 gap-3"><NativeChoice label="Game build" name="build" options={["42", "41"]} /><NativeChoice label="Game mode" name="gameMode" options={["Survivor", "Apocalypse", "Builder", "Sandbox"]} /></div><Field label="Traits" name="traits" placeholder="Keen Hearing, Smoker, Fast Learner" /><Field label="Goal for this run" name="runGoal" placeholder="Survive seven days" /><Button className="w-full" type="submit">Begin run</Button></form></DialogContent></Dialog>

      <Dialog open={logOpen} onOpenChange={setLogOpen}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>Log a session</DialogTitle><DialogDescription>Capture what matters now so the next session starts cleanly.</DialogDescription></DialogHeader>{selected && <form onSubmit={logSession} className="space-y-4"><div className="grid grid-cols-2 gap-3"><Field label="In-game day" name="day" type="number" defaultValue={selected.day} required /><Field label="Hours into day" name="hours" type="number" defaultValue={selected.hours} /></div><Field label="Entry title" name="title" placeholder="Secured a temporary base" /><TextField label="What happened?" name="summary" required placeholder="Cleared the neighboring houses and brought food back to base." /><Field label="Lesson learned" name="lesson" placeholder="Stop fighting once tired" /><Field label="Next objective" name="nextObjective" defaultValue={selected.currentObjective} /><div className="grid grid-cols-2 gap-3"><Field label="Kills" name="kills" type="number" defaultValue={selected.kills} /><Field label="Condition" name="condition" defaultValue={selected.condition} /></div><div className="grid grid-cols-2 gap-3"><Field label="Base" name="base" defaultValue={selected.base} /><Field label="Vehicle" name="vehicle" defaultValue={selected.vehicle} /><Field label="Weapon" name="weapon" defaultValue={selected.weapon} /><Field label="Supplies" name="supplies" defaultValue={selected.supplies} /></div><NativeChoice label="Outcome" name="outcome" options={["alive", "dead"]} /><Button className="w-full" type="submit">Save session</Button></form>}</DialogContent></Dialog>

      <Dialog open={advisorOpen} onOpenChange={setAdvisorOpen}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="size-5 text-primary" />Ask Knox Advisor</DialogTitle><DialogDescription>Get one Project Zomboid goal based on this run—not generic survival advice.</DialogDescription></DialogHeader>{!advice ? <form onSubmit={askAdvisor} className="space-y-4"><SelectField label="What do you need?" value={requestType} onChange={setRequestType} options={["Suggest my next goal", "Give me a survival tip", "Analyze my last session", "Help me recover from a problem"]} /><div className="grid grid-cols-2 gap-3"><SelectField label="Available time" value={playtime} onChange={setPlaytime} options={["15 minutes", "30 minutes", "45 minutes", "1 hour", "Open-ended"]} /><SelectField label="Approach" value={risk} onChange={setRisk} options={["Safe and simple", "Moderate progress", "Risky but rewarding"]} /></div><TextField label="Anything else?" name="extra" placeholder="I want to find a car, but the parking lot is crowded." /><Button className="w-full" disabled={advisorLoading} type="submit">{advisorLoading ? <><LoaderCircle className="animate-spin" />Thinking through the run…</> : <><Sparkles />Ask Knox Advisor</>}</Button></form> : <div className="space-y-4"><div className="rounded-lg border border-primary/30 bg-primary/5 p-4"><div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-semibold">{advice.title}</h3><Badge>{advice.risk} risk</Badge></div><p className="text-sm leading-6">{advice.recommendation}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{advice.reason}</p></div><ol className="space-y-2">{advice.steps.map((step, index) => <li key={`${index}-${step}`} className="flex gap-3 text-sm leading-6"><span className="font-mono text-primary">{String(index + 1).padStart(2, "0")}</span><span>{step}</span></li>)}</ol><div className="rounded-md bg-muted p-3 text-sm"><strong>Stop if:</strong> {advice.stop_condition}</div>{advice.uncertainty && <p className="text-xs text-muted-foreground">Version note: {advice.uncertainty}</p>}<div className="flex gap-2"><Button className="flex-1" onClick={useObjective}><Target />Use as objective</Button><Button variant="outline" onClick={() => setAdvice(null)}>Ask again</Button></div></div>}</DialogContent></Dialog>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="stat-box"><span>{label}</span><strong>{value}</strong></div>; }
function Fact({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
function EmptyLine({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-muted-foreground">{text}</div>; }
function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<typeof Input>) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} {...props} /></div>; }
function TextField({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<typeof Textarea>) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} {...props} /></div>; }
function NativeChoice({ label, name, options }: { label: string; name: string; options: string[] }) { return <div className="space-y-2"><Label htmlFor={name}>{label}</Label><select id={name} name={name} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">{options.map((option) => <option key={option}>{option}</option>)}</select></div>; }
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) { return <div className="space-y-2"><Label>{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>; }
