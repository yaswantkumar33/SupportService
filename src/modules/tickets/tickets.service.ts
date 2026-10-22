import { db } from "../../db";
import { tickets, UserRole, users } from "../../db/schema";
import { createTicketInput, getTicketsQueryInput, updateTicketInput } from "./tickets.schema";
import { eq, and, desc, SQL, count } from "drizzle-orm";
import { AppErr } from "../../shared/errors/app-error";


// types 

interface GetAllTicketParams {
  user: {
    userId: string;
    userRole: UserRole;
  };
  query: getTicketsQueryInput
}
// create ticket 
export const createTicket = async (input: createTicketInput & { customerId: string }) => {
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

// update ticket 
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

// get All ticket 
export const getAllTicket = async ({ user, query }: GetAllTicketParams) => {

  const { status, priority, page = 1, limit = 10 } = query;
  const offset = (page - 1) * limit;

  let queryConditions: SQL[] = [];

  if (user.userRole === "customer") queryConditions.push(eq(tickets.customerId, user.userId))

  if (status) queryConditions.push(eq(tickets.status, status));

  if (priority) queryConditions.push(eq(tickets.priority, priority));

  const whereClause = queryConditions.length > 0 ? and(...queryConditions) : undefined;

  const [ticketList, totalCountResult] = await Promise.all([
    db.query.tickets.findMany({
      where: whereClause,
      limit: limit,
      offset: offset,
      with: {
        customer: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAgent: {
          columns: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: (tickets, { desc }) => [desc(tickets.createdAt)]
    }),
    db.select({ total: count() }).from(tickets).where(whereClause)
  ])
  const totalCount = totalCountResult[0]?.total || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return { meta: { totalCount, totalPages, currentPage: page, limit, hasNextPage: page < totalPages, hasPreviousPage: page > 1 }, data: ticketList }
};

// get ticket by id 
export const getTicketById = async (ticketId: string, user: { userId: string, userRole: UserRole }) => {

  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, ticketId),
    with: {
      customer: {
        columns: { id: true, name: true, email: true }
      },
      assignedAgent: {
        columns: { id: true, name: true, email: true }
      }
    }
  })

  if (!ticket) throw new AppErr("Ticket Not Found!", 404);

  if (user.userRole === 'customer' && ticket.customerId !== user.userId) throw new AppErr("Forbidden: You do not have access to this ticket!")
  return ticket;
}
