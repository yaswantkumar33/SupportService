import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3, "Min 3 characters required!"),
  description: z.string().min(5, "Min 5 character required!"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  customerId: z.string().uuid("Customer Id must be a valid UUID!"),
  assignedAgentId: z.string().uuid().optional(),
});

export type createTicketInput = z.infer<typeof createTicketSchema>;
