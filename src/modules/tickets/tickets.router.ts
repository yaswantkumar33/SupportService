import { Router } from "express";
import { createTicketHandeler, getTicketsHandeler, updateTicketHandeler } from "./tickets.controller";
import { createCommentHandeler, getTicketCommentsHandeler } from "../comments/comments.controller";
import { authenticate } from "../../shared/middlewares/auth.middleware";

const router = Router();

// auth middleware
router.use(authenticate);

// tickets 
router.post("/", createTicketHandeler);
router.get("/", getTicketsHandeler);
router.post("/:id", updateTicketHandeler);
// ticket comments 
router.get("/:id/comments", getTicketCommentsHandeler);
router.post("/:id/comments", createCommentHandeler);

export default router;
