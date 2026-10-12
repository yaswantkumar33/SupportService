import { Router } from "express";
import { createTicketHandeler, getTicketsHandeler, updateTicketHandeler } from "./tickets.controller";

const router = Router();

router.post("/", createTicketHandeler);
router.get("/", getTicketsHandeler);
router.post("/:id", updateTicketHandeler);

export default router;
