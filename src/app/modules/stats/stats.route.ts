import { Router } from "express";
import { statController } from "./stat.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.get("/user", checkAuth(Role.ADMIN), statController.getUserStat)

export const stateRoute = router