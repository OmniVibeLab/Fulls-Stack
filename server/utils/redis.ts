import { Redis } from 'ioredis';
import { REDIS_URL } from '../config/env.config';
require('dotenv').config();

const redisClient = () => {
    if (REDIS_URL) {
        console.log(`Redis connected`);
        return REDIS_URL;
    }
    throw new Error('Redis connection failed');
};

export const redis = new Redis(redisClient());
