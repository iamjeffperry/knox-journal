export type Survivor = {
  id: string;
  name: string;
  status: string;
  build: string;
  town: string;
  occupation: string;
  traits: string;
  gameMode: string;
  day: number;
  hours: number;
  kills: number;
  condition: string;
  base: string;
  vehicle: string;
  weapon: string;
  supplies: string;
  currentObjective: string;
  runGoal: string;
  causeOfDeath: string | null;
  updatedAt: string;
};

export type Session = {
  id: string;
  survivorId: string;
  day: number;
  title: string;
  summary: string;
  lesson: string;
  nextObjective: string;
  outcome: string;
  createdAt: string;
};

export type JournalSnapshot = {
  survivors: Survivor[];
  sessions: Session[];
};

type MutationResult = { survivor?: Survivor };

export interface JournalStore {
  load(): Promise<JournalSnapshot>;
  mutate(payload: Record<string, unknown>): Promise<MutationResult>;
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The journal request failed.");
  return data;
}

export const hostedJournalStore: JournalStore = {
  async load() {
    const response = await fetch("/api/journal", { cache: "no-store" });
    const data = await readJson<Partial<JournalSnapshot>>(response);
    return { survivors: data.survivors ?? [], sessions: data.sessions ?? [] };
  },

  async mutate(payload) {
    const response = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return readJson<MutationResult>(response);
  },
};
