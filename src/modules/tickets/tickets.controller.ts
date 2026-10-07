import { Request, Response } from "express";
import { createTicketSchema } from "./tickets.schema";
import * as ticketService from "./tickets.service";

export const createTicketHandeler = async (req: Request, res: Response) => {
  try {
    const validatedReqData = createTicketSchema.parse(req.body);
    const ticket = await ticketService.createTicket(validatedReqData);
    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return res.status(400).json({ success: false, errors: e.errors });
    }
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getTicketsHandeler = async (req: Request, res: Response) => {
  try {
    const ticketsList = await ticketService.getAllTicket();
    res.status(200).json({ success: true, data: ticketsList });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};
