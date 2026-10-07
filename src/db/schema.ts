import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
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
    assignedAgentId: uuid("assigned_agent_id").references(() => users.id, {
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

// declaring the drizzlee relationships here at the schema

export const userRelations = relations(users, ({ many }) => ({
  tickets: many(tickets, { relationName: "customerTickets" }),
  assignedTickets: many(tickets, { relationName: "agentTickets" }),
}));

export const ticketRealtions = relations(tickets, ({ one }) => ({
  customer: one(users, {
    fields: [tickets.customerId],
    references: [users.id],
    relationName: "customerTickets",
  }),
  assignedAgent: one(users, {
    fields: [tickets.assignedAgentId],
    references: [users.id],
    relationName: "agentTickets",
  }),
}));
