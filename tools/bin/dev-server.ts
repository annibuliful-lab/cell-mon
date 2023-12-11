import { config } from 'dotenv';
import { main as primaryBackend } from '../../apps/backend/src/app';
import { main as coreBackend } from '../../apps/backend-core/src/app';
import { main as jobWorker } from '../../apps/job-worker/src/app';
config();

const runningServerService = async () => {
  await primaryBackend();

  if (process.env.NODE_ENV !== 'ci') {
    await coreBackend();
  }

  await jobWorker();
  // const used = process.memoryUsage();
  // for (const key in used) {
  //   console.log(
  //     `Memory: ${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`,
  //   );
  // }
  // console.log('\n');
};

runningServerService();
