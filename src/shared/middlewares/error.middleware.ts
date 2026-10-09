import { Request, Response, NextFunction } from "express";
import { ZodError } from 'zod';
import { AppErr } from "../errors/app-error";


export const errorHandeler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {

    // handle the zod errors 
    if (err instanceof ZodError) {
        const formattedErrs = err.issues.map((e: any) => ({
            field: e.path.join('.'),
            message: e.message
        }))

        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: formattedErrs
        })
    }
    // handle our operational error from our code 
    if (err instanceof AppErr) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }
    //fallback handeler
    console.error("Unhandled Error Occured", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error!"
    })

}