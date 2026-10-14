import { z } from "zod";
export const createCommentSchema = z.object({
    authorId: z.uuid("Invalid author ID Formate!"),
    content: z.string().min(1, "Comment content cannot be empty"),
});

export type createCommentInput = z.infer<typeof createCommentSchema>;
