import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { SocketClient } from "./models/socketClient.model";
import { redis } from "./utils/redis";

export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server);

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId as string;

        if (!userId) return;

        console.log(`User connected: ${userId}, socket: ${socket.id}`);

        try {
            // Save in MongoDB
            await SocketClient.findOneAndUpdate(
                { userId },
                { socketId: socket.id, connectedAt: new Date() },
                { upsert: true }
            );

            // Save in Redis
            await redis.set(`socket:${userId}`, socket.id);

        } catch (err) {
            console.error("Error saving socket info:", err);
        }

        // Listen for notifications
        socket.on("notification", (data) => {
            io.emit("newNotification", data);
        });

        // On disconnect
        socket.on("disconnect", async () => {
            console.log(`User disconnected: ${userId}, socket: ${socket.id}`);

            try {
                // Remove from MongoDB
                await SocketClient.deleteOne({ socketId: socket.id });

                // Remove from Redis
                await redis.del(`socket:${userId}`);
            } catch (err) {
                console.error("Error removing socket info:", err);
            }
        });
    });
};
