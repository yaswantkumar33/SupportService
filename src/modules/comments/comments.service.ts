import { eq } from "drizzle-orm";
import { db } from "../../db";
import { AppErr } from "../../shared/errors/app-error";
import { createCommentInput } from "./comments.schema";
import { tickets, ticketComments, users } from './../../db/schema';


export const createComment = async (ticketId: string, data: createCommentInput & { authorId: string }) => {

    // check if the ticket is existing 
    const ticketExists = db.query.tickets.findFirst({
        where: eq(tickets.id, ticketId)
    })
    if (!ticketExists) throw new AppErr("Ticket Not Found!", 404);

    // check if the user is existing 
    const userExists = db.query.users.findFirst({
        where: eq(users.id, data.authorId)
    })
    if (!userExists) throw new AppErr("Author Not Found!", 404)

    const [newComment] = await db.insert(ticketComments).values({
        ticketId, authorId: data.authorId, content: data.content
    }).returning()

    return newComment;

}

export const getComment = async (ticketId: string) => {

    // check if the ticket is existing 
    const ticketExists = db.query.tickets.findFirst({
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