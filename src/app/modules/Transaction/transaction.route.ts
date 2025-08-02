import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { transactionController } from "./transaction.controller";

const router = Router()

router.post("/add-money", checkAuth(Role.USER), transactionController.addMoney)
router.post("/send-money", checkAuth(Role.USER), transactionController.sendMoney)
router.post("/withdraw-money", checkAuth(Role.USER), transactionController.withdrawMoney)
router.get("/history", checkAuth(Role.USER), transactionController.transactionHistory)
export const TransactionRoute = router