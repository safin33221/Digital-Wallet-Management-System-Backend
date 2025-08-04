import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post('/login', authController.credentialLogin)
router.post('/logout', authController.logout)
export const AuthRoute = router