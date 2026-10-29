import { Router } from "express";
import { createTicketHandeler, getTicketByIdHandeler, getTicketsHandeler, updateTicketHandeler } from "./tickets.controller";
import { createCommentHandeler, getTicketCommentsHandeler } from "../comments/comments.controller";
import { authenticate } from "../../shared/middlewares/auth.middleware";
import { requiredRole } from "../../shared/middlewares/role.middleware";
import { getTicketAuditHandeler } from "../audit-logs/audit-logs.controller";
import { getTicketAttachmentsHandeler, uploadAttachmentHandeler } from "../attachments/attachments.controller";
import { uploadAttachement } from "../../shared/middlewares/upload.middleware";

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

//Tickets Attachments
router.post('/:id/attachments', uploadAttachement.single('file'), uploadAttachmentHandeler)
router.get('/:id/attachments', getTicketAttachmentsHandeler)

router.get("/:id/audit-logs", getTicketAuditHandeler)


export default router;
