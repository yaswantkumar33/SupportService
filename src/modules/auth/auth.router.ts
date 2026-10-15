import { Router } from "express";
import { registerHandeler } from "./auth.controller";

const router = Router();


router.post('/register', registerHandeler)

export default router;