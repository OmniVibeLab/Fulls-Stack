import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config";

export interface IUser extends Document {
    username: string;
    email: string;
    fullName: string;
    password: string;
    avatar?: string;
    bio?: string;
    followers: IUserSummary[];
    following: IUserSummary[];
    role: "user" | "admin",
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
    generateAccessToken(): string;
}

export interface IUserSummary {
    userId: mongoose.Types.ObjectId;
    username: string;
    avatar?: string;
}

const UserSummarySchema = new Schema<IUserSummary>({
    userId: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    avatar: { type: String }
});

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    role: { type: String, default: "user" },
    followers: { type: [UserSummarySchema], default: [] },
    following: { type: [UserSummarySchema], default: [] },
}, { timestamps: true });

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        { id: this._id, username: this.username },
        JWT_SECRET! || "supersecret",
        { expiresIn: "1h" }
    );
};

export const User = mongoose.model<IUser>("User", UserSchema);
