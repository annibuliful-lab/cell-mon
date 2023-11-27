import { main } from './queue';
import { workerA } from './worker-a';
import { workerB } from './worker-b';

main();

process.on('SIGINT', async () => {
  await workerA.close();
  await workerB.close();
});

process.on('SIGTERM', async () => {
  await workerA.close();
  await workerB.close();
});
