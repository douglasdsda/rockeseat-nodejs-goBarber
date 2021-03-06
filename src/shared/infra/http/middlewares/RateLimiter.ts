import { Request, Reponse, NextFunction } from 'express';

import redis from 'redis';

import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppErros';

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REdis_PORT),
    password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 500,
    duration: 1,
});

export default async function rateLimiter(
    request: Request,
    response: Reponse,
    next: NextFunction,
): Promise<void> {
    try {
        await limiter.consume(request.ip);
        return next();
    } catch (err) {
        throw new AppError('Too many requests', 429);
    }
}
