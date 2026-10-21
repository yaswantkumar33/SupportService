import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import * as authService from "./auth.service";

export const registerHandeler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const user = await authService.registerUser(validatedData);

        res.status(200).json({
            success: true,
            Message: "User Registered Sucessfully",
            data: user,
        })


    } catch (e) { next(e) }

}

export const loginHandeler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.parse(req.body)
        const result = await authService.loginUser(validatedData)

        res.status(200).json({
            success: true,
            messgage: "Login sucessfull",
            data: result
        })

    } catch (e) { next(e) }
}