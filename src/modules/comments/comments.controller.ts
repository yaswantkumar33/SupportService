import { Request, Response, NextFunction } from "express";
import { createCommentSchema } from "./comments.schema";
import * as commentService from "./comments.service";


export const createCommentHandeler = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {


    try {
        const ticketId = req.params.id;
        const validatedData = createCommentSchema.parse(req.body);
        const authorId = req.user!.userId;
        const newComment = await commentService.createComment(ticketId, { authorId, content: validatedData.content })

        res.status(200).json({
            sucess: true,
            message: "Comment Added Successfully",
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