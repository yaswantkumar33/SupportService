import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { UserRole } from "../../db/schema";
import { AppErr } from "../errors/app-error";
import { env } from "../../config/env";


interface JwtPayload {
    userId: string;
    userRole: UserRole;
}


export const authenticate = (req: Request, _res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) return next(new AppErr('Authentication token missing or malformed', 401));

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.user = {
            userId: decodedToken.userId,
            userRole: decodedToken.userRole
        };

        next();

    } catch (e) { next(new AppErr("Invalid or expired authentication token!", 401)) }

}