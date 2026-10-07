import { Router } from "express";
import { createUserHandeler, getUsersHandler } from "./users.controller";

const router = Router();

router.post("/", createUserHandeler);
router.get("/", getUsersHandler);

export default router;
