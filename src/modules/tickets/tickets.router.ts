import { Router } from "express";
import { createTicketHandeler, getTicketsHandeler } from "./tickets.controller";

const router = Router();

router.post("/", createTicketHandeler);
router.get("/", getTicketsHandeler);

export default router;
