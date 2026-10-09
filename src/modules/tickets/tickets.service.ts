import { error } from "console";
import { db } from "../../db";
import { tickets, users } from "../../db/schema";
import { createTicketInput } from "./tickets.schema";
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
