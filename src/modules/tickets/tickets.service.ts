import { db } from "../../db";
import { tickets, users } from "../../db/schema";
import { createTicketInput, updateTicketInput } from "./tickets.schema";
import { eq } from "drizzle-orm";
import { AppErr } from "../../shared/errors/app-error";

export const createTicket = async (input: createTicketInput) => {
  // 1.need to validate the customer is there or not
  const customerExists = await db.query.users.findFirst({
    where: eq(users.id, input.customerId),
  });

  if (!customerExists)
    throw new AppErr("Customer Not found to create the ticket!");

  // 2.insert the ticket into the ticket table

  const [ticketAdded] = await db.insert(tickets).values(input).returning();
  return ticketAdded;
};

export const updateTicket = async (ticketId: string, input: updateTicketInput) => {


  const ticketExists = await db.query.tickets.findFirst({
    where: eq(tickets.id, ticketId)
  })

  if (!ticketExists) throw new AppErr("Ticket Not Found!!");
  if (input.assignedAgentId) {
    const agentUser = await db.query.users.findFirst({
      where: eq(users.id, input.assignedAgentId)
    })

    if (!agentUser) throw new AppErr("Assigned agent does not exist", 400);
    if (agentUser.role === "customer") throw new AppErr("Cannot assign ticket to the user with role as customer!", 400)
  }

  const [updatedTicket] = await db
    .update(tickets)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, ticketId))
    .returning();
  return updatedTicket;
}

export const getAllTicket = async () => {
  return await db.query.tickets.findMany({
    with: {
      customer: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
