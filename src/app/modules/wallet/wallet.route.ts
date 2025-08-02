import { Router } from "express";
import { walletController } from "./wallet.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()
router.get('/me', checkAuth(Role.USER), walletController.getMyWallet)


export const WalletRoute = router