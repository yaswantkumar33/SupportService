import { db } from "../../db";
import { auditLogs } from "../../db/schema";



interface CreateAuditLogParams {
    ticketId: string;
    performedById: string;
    action: string;
    oldValues: Record<string, unknown> | null;
    newValues: Record<string, unknown> | null;
}


export const createAuditLog = async ({ ticketId, performedById, action, oldValues, newValues }: CreateAuditLogParams) => {
    const [log] = await db.insert(auditLogs).values({
        ticketId, performedById, action, oldValues, newValues
    }).returning()

    return log;
}