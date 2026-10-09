import { Request, Response, NextFunction } from "express";
import { createTicketSchema } from "./tickets.schema";
import * as ticketService from "./tickets.service";

export const createTicketHandeler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedReqData = createTicketSchema.parse(req.body);
    const ticket = await ticketService.createTicket(validatedReqData);
    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (e: any) {
    next(e);
  }
};

export const getTicketsHandeler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticketsList = await ticketService.getAllTicket();
    res.status(200).json({ success: true, data: ticketsList });
  } catch (e: any) {
    next(e);
  }
};
