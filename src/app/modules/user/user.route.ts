import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserZod, updateUserZod } from "./user.validation";

const router = Router()

router.post("/create",
    validateRequest(createUserZod),
    userController.createUser)
router.get("/",
    checkAuth(Role.ADMIN),
    userController.getUsers)

router.patch("/:userId",
    validateRequest(updateUserZod),
    checkAuth(...Object.values(Role)),
    userController.updatedUser)

export const UserRoutes = router 