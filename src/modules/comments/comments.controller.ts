import { Request, Response, NextFunction } from "express";
import { createCommentSchema } from "./comments.schema";
import * as commentService from "./comments.service";


export const createCommentHandeler = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {


    try {
        const ticketId = req.params.id;
        console.log(ticketId);
        const validatedData = createCommentSchema.parse(req.body);
        const newComment = await commentService.createComment(ticketId, validatedData)

        res.status(200).json({
            sucess: true,
            data: newComment
        })
    } catch (e) { next(e) }

}

export const getTicketCommentsHandeler = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {

    try {
        const ticketId = req.params.id;
        const comments = await commentService.getComment(ticketId);

        res.status(200).json({
            sucess: true,
            data: comments
        })
    } catch (e) { next(e) }

}