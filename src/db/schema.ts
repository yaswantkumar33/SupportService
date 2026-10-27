import { relations } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
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
  password: text('password').notNull(),
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
// ticket commnets  table
export const ticketComments = pgTable("ticket_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// Audit Logs Table 

export const auditLogs = pgTable('audit_logs', {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid('ticket_id').notNull().references(() => tickets.id, { onDelete: 'cascade' }),
  performedById: uuid('performed_by_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_audit_logs_ticket_id').on(table.ticketId),
  index('idx_audit_logs_performed_by').on(table.performedById),
])

// declaring the drizzlee relationships here at the schema
export const userRelations = relations(users, ({ many }) => ({
  tickets: many(tickets, { relationName: "customerTickets" }),
  assignedTickets: many(tickets, { relationName: "agentTickets" }),
}));

export const ticketRealtions = relations(tickets, ({ one, many }) => ({
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
  auditLogs: many(auditLogs)
}));

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketComments.ticketId],
    references: [tickets.id],
  }),
  author: one(users, {
    fields: [ticketComments.authorId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  ticket: one(tickets, {
    fields: [auditLogs.ticketId],
    references: [tickets.id]
  }),
  performedBy: one(users, {
    fields: [auditLogs.performedById],
    references: [users.id]
  })
}))

// type exports 
export type User = typeof users.$inferSelect;
export type UserRole = User['role'];

export type Ticket = typeof tickets.$inferSelect;
export type TicketStatus = (typeof statusEnum.enumValues)[number];
export type TicketComment = typeof ticketComments.$inferSelect;

export type AuditLog = typeof auditLogs.$inferSelect;
