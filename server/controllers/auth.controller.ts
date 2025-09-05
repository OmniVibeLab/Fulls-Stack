import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { catchAsyncError } from "../utils/catchAsyncErrors";
import { User } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CookieOptions } from "express";
import { NODE_ENV } from "../config/env.config";
import { redis } from "../utils/redis";

export const registerSchema = z.object({
    username: z.string().min(3, { error: "Username must be at least 3 characters long" }),
    email: z.email({ error: "Please provide a valid email address" }),
    fullName: z.string().min(3, { error: "Full name must be at least 3 characters long" }),
    password: z.string().min(6, { error: "Password must be at least 6 characters long" }),
});



const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
};

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            let issues = parsed.error.issues.map((e) => e.path)
            return next(new ErrorHandler(issues, 400))
        }

        const { username, email, fullName, password } = parsed.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) return next(new ErrorHandler("User already exists", 400));

        const newUser = await User.create({ username, email, fullName, password });
        const token = newUser.generateAccessToken();

        const redisData = {
            id: newUser._id,
            username,
            email,
            role: newUser.role
        }
        const id: string = newUser._id as string
        await redis.set(id, JSON.stringify(redisData))
        res
            .status(201)
            .cookie("token", token, cookieOptions)
            .json({ success: true, user: { id: newUser._id, username, email, fullName, role: newUser.role } });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const loginSchema = z.object({
    email: z.email({ error: "Please provide a valid email address" }),
    password: z.string().min(6, { error: "Password must be at least 6 characters long" })
});

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            let issues = parsed.error.issues.map((e) => `Error on ${e.path}`)
            return next(new ErrorHandler(issues, 400))
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) return next(new ErrorHandler("Invalid credentials", 401));

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

        const token = user.generateAccessToken();

        const redisData = {
            id: user._id,
            username: user.username,
            email,
            role: user.role
        }
        const id: string = user._id as string
        await redis.set(id, JSON.stringify(redisData))

        res
            .status(200)
            .cookie("token", token, cookieOptions)
            .json({ success: true, user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role } });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
