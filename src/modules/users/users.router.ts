import { Router } from "express";
import {
  createUserHandeler,
  getUsersHandler,
  getUsersWithTickets,
} from "./users.controller";

const router = Router();

router.post("/", createUserHandeler);
// router.get("/", getUsersHandler);
router.get("/", getUsersWithTickets);

export default router;
