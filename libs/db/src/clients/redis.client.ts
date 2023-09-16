import { config } from 'dotenv';
import Redis from 'ioredis';
import { noop } from 'lodash';
config();

let _redisClient: Redis;

function getRedisClient() {
  if (_redisClient) {
    return _redisClient;
  }

  _redisClient = new Redis(process.env.REDIS_URL as unknown as number, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    retryStrategy: noop,
  });

  return _redisClient;
}

export const redisClient = getRedisClient();
