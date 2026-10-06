import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email formate!!!"),
  name: z.string().min(2, "Must be minium of two characters!!!"),
  role: z.enum(["customer", "admin", "agent"]).default("customer"),
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
