import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";

const router = Router()

router.post("/create", userController.createUser)
router.get("/",
    // checkAuth(Role.ADMIN),
     userController.getUsers)

router.patch("/:userId", checkAuth(...Object.values(Role)), userController.updatedUser)

export const UserRoutes = router 