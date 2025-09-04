import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// /omnivibe/auth/register
router.post("/register", register);

// /omnivibe/auth/login
router.post("/login", login);

export default router;
