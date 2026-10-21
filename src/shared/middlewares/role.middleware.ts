import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../db/schema";
import { AppErr } from "../errors/app-error";

export const requiredRole = (...allowedRoles: UserRole[]) => {

    return (req: Request, _res: Response, next: NextFunction) => {

        if (!req.user) return next(new AppErr("Authentication required", 401))

        if (!allowedRoles.includes(req.user.userRole)) return next(new AppErr("Forbidden: You do not have permission to perfom this action", 403))

        next();
    }

}