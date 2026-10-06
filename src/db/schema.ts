import { table } from "console";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { string } from "zod";
import { describe } from "zod/v4/core";

// Enuma we are used in users and tickets db
export const roleEnum = pgEnum("role", ["customer", "agent", "admin"]);
export const statusEnum = pgEnum("status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);
export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

// Tables
// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 225 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: roleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// Ticket table
export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: statusEnum("status").default("open").notNull(),
    priority: priorityEnum("priority").default("medium").notNull(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    aassignedAgentId: uuid("assigned_agent_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // db indexes for faster quering
    index("idx_tickets_cusomter_id").on(table.customerId),
    index("idx_tickets_status").on(table.status),
  ],
);
