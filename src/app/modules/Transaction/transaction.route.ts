import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { transactionController } from "./transaction.controller";

const router = Router()

router.post("/add-money", checkAuth(Role.USER), transactionController.addMoney)
export const TransactionRoute = router