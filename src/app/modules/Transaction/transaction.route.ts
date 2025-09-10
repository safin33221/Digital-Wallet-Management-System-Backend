import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import { transactionController } from "./transaction.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { transactionZodSchema } from "./transaction.validation";

const router = Router()

router.post("/add-money",
    checkAuth(...Object.values(Role)),
    transactionController.addMoney)

router.post("/send-money",
    validateRequest(transactionZodSchema),
    checkAuth(Role.USER),
    transactionController.sendMoney)

router.post("/withdraw-money",
    validateRequest(transactionZodSchema),
    checkAuth(Role.USER),
    transactionController.withdrawMoney)

router.get("/my-transaction",
    checkAuth(...Object.values(Role)),
    transactionController.myTransactionHistory)



//Agents transaction
router.post("/cash-in",
    checkAuth(Role.AGENT),
    transactionController.cashIn)
router.post("/cash-out",
    checkAuth(Role.USER),
    transactionController.cashOut)


//admin 
router.get("/all-transaction",
    checkAuth(Role.ADMIN),
    transactionController.getAllTransaction)




export const TransactionRoute = router