import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { WalletRoute } from "../modules/wallet/wallet.route";

export const router = Router()


const modulesRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/wallet",
        route: WalletRoute
    }
]

modulesRoutes.forEach(route => {
    router.use(route.path, route.route)
})


