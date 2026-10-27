import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { auditLogs, tickets, UserRole } from "../../db/schema";
import { AppErr } from "../../shared/errors/app-error";



interface CreateAuditLogParams {
    ticketId: string;
    performedById: string;
    action: string;
    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;
}

interface GetAuditLogsParams {
    ticketId: string;
    user: {
        userId: string,
        userRole: UserRole
    }
}

// CREATE AUDIT LOGS 
export const createAuditLog = async ({ ticketId, performedById, action, oldValues, newValues }: CreateAuditLogParams) => {
    const [log] = await db.insert(auditLogs).values({
        ticketId, performedById, action, oldValues, newValues
    }).returning()

    return log;
}

// GET AUDIT LOGS 

export const getAuditLogs = async ({ ticketId, user }: GetAuditLogsParams) => {

    const ticketExists = await db.query.tickets.findFirst({
        where: eq(tickets.id, ticketId),
    })

    if (!ticketExists) throw new AppErr("Ticket not found!", 404);

    if (user.userRole === "customer" && ticketExists.customerId !== user.userId) throw new AppErr("Forbidden: Your are not authorized to view the audit logs of this ticket");

    const logs = await db.query.auditLogs.findMany({
        where: eq(auditLogs.ticketId, ticketId),
        orderBy: [desc(auditLogs.createdAt)],
        with: {
            performedBy: {
                columns: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    })

    return logs

}