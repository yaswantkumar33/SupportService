import { Router } from "express";
import {
  createUserHandeler,
  deleteUser,
  getUsersHandler,
  getUsersWithTickets,
} from "./users.controller";

const router = Router();

router.post("/", createUserHandeler);
// router.get("/", getUsersHandler);
router.get("/", getUsersWithTickets);
router.delete("/:id", deleteUser);

export default router;
