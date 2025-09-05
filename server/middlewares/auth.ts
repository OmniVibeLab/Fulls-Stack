import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env.config";
import { catchAsyncError } from "../utils/catchAsyncErrors";
import { redis } from "../utils/redis";

export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            const token = req.cookies.token as string;

            if (!token) return next(new ErrorHandler("Please login to access this resource", 401));

            const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
            if (!decoded || !decoded.id) return next(new ErrorHandler("Access token is not valid", 401));

            const user = await redis.get(decoded.id);
            
            if (!user) return next(new ErrorHandler("Please login to access this resource", 401));
            req.user = JSON.parse(user);
            next();
        } catch (error: any) {
            return next(new ErrorHandler(error.message || "Authentication failed", 401));
        }
    }
);

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user?.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
