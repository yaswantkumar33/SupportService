import { Request, Response, NextFunction } from "express";
import { createTicketSchema, getTicketsQuerySchema, updateTicketSchema } from "./tickets.schema";
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

    const query = getTicketsQuerySchema.parse(req.query);
    const ticketsList = await ticketService.getAllTicket(query);
    res.status(200).json({ success: true, data: ticketsList });
  } catch (e: any) {
    next(e);
  }
};


export const updateTicketHandeler = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {

  try {
    const { id } = req.params;
    const validatedReqData = updateTicketSchema.parse(req.body);
    const updatedTicket = await ticketService.updateTicket(id, validatedReqData);
    res.status(200).json({
      success: true,
      data: updatedTicket
    })

  } catch (e) {
    next(e);
  }
}
