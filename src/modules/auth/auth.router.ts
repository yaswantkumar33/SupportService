import { Router } from "express";
import { loginHandeler, registerHandeler } from "./auth.controller";

const router = Router();


router.post('/register', registerHandeler)
router.post('/login', loginHandeler)

export default router;