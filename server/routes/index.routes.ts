import { Router } from "express"
import authRoutes from "../routes/auth.routes"
import postRoutes from "../routes/post.route"
import { authorizeRoles, isAuthenticated } from "../middlewares/auth"
const router = Router()
router.use("/auth", authRoutes)
router.use("/posts", isAuthenticated, authorizeRoles("user"), postRoutes)
export default router