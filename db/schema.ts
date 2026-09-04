import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const survivors = sqliteTable("survivors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("alive"),
  build: text("build").notNull().default("42"),
  town: text("town").notNull(),
  occupation: text("occupation").notNull(),
  traits: text("traits").notNull().default(""),
  gameMode: text("game_mode").notNull().default("Survivor"),
  day: integer("day").notNull().default(1),
  hours: integer("hours").notNull().default(0),
  kills: integer("kills").notNull().default(0),
  condition: text("condition").notNull().default("Healthy"),
  base: text("base").notNull().default("None yet"),
  vehicle: text("vehicle").notNull().default("None"),
  weapon: text("weapon").notNull().default("Unarmed"),
  supplies: text("supplies").notNull().default("Unknown"),
  currentObjective: text("current_objective").notNull().default("Find shelter and basic supplies"),
  runGoal: text("run_goal").notNull().default(""),
  causeOfDeath: text("cause_of_death"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  endedAt: text("ended_at"),
}, (table) => [index("idx_survivors_status_updated").on(table.status, table.updatedAt)]);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  survivorId: text("survivor_id").notNull().references(() => survivors.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  lesson: text("lesson").notNull().default(""),
  nextObjective: text("next_objective").notNull().default(""),
  outcome: text("outcome").notNull().default("alive"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_sessions_survivor_created").on(table.survivorId, table.createdAt)]);
