import { Request, Response, NextFunction } from "express";
import { createUserSchema } from "./users.schema";
import * as userService from "./users.service";

export const createUserHandeler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedReqData = createUserSchema.parse(req.body);
    const user = await userService.createUser(validatedReqData);
    res.status(200).json({ success: true, data: user });
  } catch (e: any) {
    next(e);
  }
};

export const getUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersList = await userService.getAllUsers();
    res.status(200).json({ success: true, data: usersList });
  } catch (e: any) {
    next(e);

  }
};

export const getUsersWithTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usersListWithTicket = await userService.getUsersWithTicketes();
    res.status(200).json({ success: true, data: usersListWithTicket });
  } catch (e: any) {
    next(e);

  }
};
