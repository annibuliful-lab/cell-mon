import { config } from 'dotenv';
import redis, { type MQEmitterRedis } from 'mqemitter-redis';

config();

let mqRedis: MQEmitterRedis;

function getMqEmitterClient() {
  if (mqRedis) {
    return mqRedis;
  }

  mqRedis = redis({
    connectionString: process.env.REDIS_URL,
  });

  return mqRedis;
}

export const mqRedisEmitter = getMqEmitterClient();
