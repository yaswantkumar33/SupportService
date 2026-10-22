import { eq } from "drizzle-orm";
import { db } from "../../db";
import { AppErr } from "../../shared/errors/app-error";
import { createCommentInput } from "./comments.schema";
import { tickets, ticketComments, users, UserRole } from './../../db/schema';

// type 
interface CreateCommentParams {
    ticketId: string;
    authorId: string;
    userRole: UserRole;
    content: string;
}
export const createComment = async ({ ticketId, authorId, userRole, content }: CreateCommentParams) => {

    // check if the ticket is existing 
    const ticketExists = await db.query.tickets.findFirst({
        where: eq(tickets.id, ticketId)
    })
    if (!ticketExists) throw new AppErr("Ticket Not Found!", 404);

    const isOwner = ticketExists.customerId === authorId;

    const isAssignedAgent = ticketExists.assignedAgentId === authorId;

    const isAdmin = userRole === 'admin'

    if (!isOwner && !isAssignedAgent && !isAdmin) throw new AppErr("Forbidden: Your not allowed to commnet in this ticket", 403);

    console.log("errors Passed", isAdmin, isAssignedAgent, isOwner)


    const [newComment] = await db.insert(ticketComments).values({
        ticketId, authorId, content
    }).returning()

    return newComment;

}

export const getComment = async (ticketId: string) => {

    // check if the ticket is existing 
    const ticketExists = await db.query.tickets.findFirst({
        where: eq(tickets.id, ticketId)
    })
    if (!ticketExists) throw new AppErr("Ticket Not Found!", 404);

    return await db.query.ticketComments.findMany({
        where: eq(ticketComments.ticketId, ticketId),
        with: {
            author: {
                columns: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }, orderBy: (comments, { asc }) => [asc(comments.createdAt)]
    })
}