import { NextFunction, Request, Response } from "express";
import * as  auditLogsService from "./audit-logs.service";



export const getTicketAuditHandeler = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {


    try {

        const { id: ticketId } = req.params;

        const logs = await auditLogsService.getAuditLogs({ ticketId, user: req.user! })

        res.status(200).json({
            success: true,
            message: 'Audit Logs reterived successfully',
            data: logs
        })

    } catch (e) { next(e) }


}