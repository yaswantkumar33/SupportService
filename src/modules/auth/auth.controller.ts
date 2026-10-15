import { Request, Response, NextFunction } from "express";
import { registerSchema } from "./auth.schema";
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

// export const loginHandeler = async (req: Request, res: Response, next: NextFunction){
//     try {


//      } catch (e) { next(e) }
// }