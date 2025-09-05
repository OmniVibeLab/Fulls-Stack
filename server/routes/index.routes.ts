import { Router } from "express"
import authRoutes from "./auth.routes"
import postRoutes from "./post.route"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth"
const router = Router()
router.use("/auth", authRoutes)
router.use("/posts", isAuthenticated, authorizeRoles("user"), postRoutes)
export default router