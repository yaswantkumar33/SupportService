import { Request, Response } from "express";
import { createUserSchema } from "./users.schema";
import * as userService from "./users.service";

export const createUserHandeler = async (req: Request, res: Response) => {
  try {
    const validatedReqData = createUserSchema.parse(req.body);
    const user = await userService.createUser(validatedReqData);
    res.status(200).json({ success: true, data: user });
  } catch (e: any) {
    if (e.name === "ZodError") {
      return res.status(400).json({ success: false, errors: e.errors });
    }
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getUsersHandler = async (req: Request, res: Response) => {
  try {
    const usersList = await userService.getAllUsers();
    res.status(200).json({ success: true, data: usersList });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};
