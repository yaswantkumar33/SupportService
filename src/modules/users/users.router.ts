import { Router } from "express";
import {
  createUserHandeler,
  deleteUser,
  getUsersHandler,
  getUsersWithTickets,
} from "./users.controller";
import { requiredRole } from "../../shared/middlewares/role.middleware";

const router = Router();

router.post("/", createUserHandeler);
// router.get("/", getUsersHandler);
router.get("/", getUsersWithTickets);
router.delete("/:id", requiredRole('admin'), deleteUser);

export default router;
