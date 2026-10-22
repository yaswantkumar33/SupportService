import { Router } from "express";
import { createTicketHandeler, getTicketByIdHandeler, getTicketsHandeler, updateTicketHandeler } from "./tickets.controller";
import { createCommentHandeler, getTicketCommentsHandeler } from "../comments/comments.controller";
import { authenticate } from "../../shared/middlewares/auth.middleware";
import { requiredRole } from "../../shared/middlewares/role.middleware";
import { getTicketById } from "./tickets.service";

const router = Router();

// auth middleware
router.use(authenticate);

// tickets 
router.post("/", createTicketHandeler);
router.get("/", getTicketsHandeler);
router.get("/:id", getTicketByIdHandeler);
router.patch("/:id", requiredRole('agent', 'admin'), updateTicketHandeler);
// ticket comments 
router.get("/:id/comments", getTicketCommentsHandeler);
router.post("/:id/comments", createCommentHandeler);

export default router;
