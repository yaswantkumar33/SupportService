import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3, "Min 3 characters required!"),
  description: z.string().min(5, "Min 5 character required!"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

export const updateTicketSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedAgentId: z.string().min(3).optional(),
});

export const getTicketsQuerySchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
})

export type createTicketInput = z.infer<typeof createTicketSchema>;
export type updateTicketInput = z.infer<typeof updateTicketSchema>;
export type getTicketsQueryInput = z.infer<typeof getTicketsQuerySchema>;
