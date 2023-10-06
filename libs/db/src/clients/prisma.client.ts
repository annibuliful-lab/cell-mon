import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

import { prismaClientOption } from '../@types';

config();

let _primaryPrismaClient: PrismaClient<typeof prismaClientOption> | null = null;

function getClient(): PrismaClient<typeof prismaClientOption> {
  if (_primaryPrismaClient) {
    return _primaryPrismaClient;
  }

  const shouldLog = process.env.ENABLED_TRACING === 'true';

  _primaryPrismaClient = new PrismaClient(
    shouldLog
      ? {
          log: [
            {
              emit: 'event',
              level: 'query',
            },
            {
              emit: 'stdout',
              level: 'error',
            },
            {
              emit: 'stdout',
              level: 'info',
            },
            {
              emit: 'stdout',
              level: 'warn',
            },
          ],
        }
      : undefined,
  );

  if (shouldLog) {
    _primaryPrismaClient.$on('query', (e) => {
      console.log({
        target: e.target,
        query: e.query,
        params: e.params,
        duration: `${e.duration} ms`,
      });
    });
  }

  return _primaryPrismaClient;
}

export const prismaDbClient = getClient();
