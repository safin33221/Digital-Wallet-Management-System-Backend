import { Router } from "express";
import { statController } from "./stat.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.get("/user", checkAuth(Role.ADMIN), statController.getUserStat)
router.get("/transaction", checkAuth(Role.ADMIN), statController.getTransactionStat)
router.get("/get-single-agent-TransactionStat", checkAuth(Role.AGENT), statController.getSingleAgentTransactionStat)

export const stateRoute = router