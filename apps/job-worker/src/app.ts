import { jobDbClient, primaryDbClient } from '@cell-mon/db';
import { logger } from '@cell-mon/utils';

import { hlrWebhookWorker } from './hlr/webhook';

export async function main() {
  logger.info('🚀 Job worker ready');
  async function gracefulShutdown() {
    await jobDbClient.destroy();
    await primaryDbClient.destroy();
    await hlrWebhookWorker.close(true);
    process.exit(1);
  }
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}
