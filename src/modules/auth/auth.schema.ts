import { email, z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, "The name must be min 2 characters!"),
    email: z.email("Invalid email address!"),
    password: z.string().min(6, 'Password must be at least 6 characters!'),
    role: z.enum(['customer', 'agent', 'admin']).optional().default('customer')
})

export const loginSchema = z.object({
    email: z.email('Invalid email address!'),
    password: z.string().min(1, 'Password Required')
})


export type registerInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;