import { config } from 'dotenv';
import redis, { type MQEmitterRedis } from 'mqemitter-redis';

config();
console.log('process.env.REDIS_URL', process.env.REDIS_URL);
let mqRedis: MQEmitterRedis;

function getMqEmitterClient() {
  if (!process.env.REDIS_URL) {
    throw new Error('please add REDIS_URL to .env');
  }

  if (mqRedis) {
    return mqRedis;
  }

  mqRedis = redis({
    connectionString: process.env.REDIS_URL,
  });

  return mqRedis;
}

export const mqRedisEmitter = getMqEmitterClient();
